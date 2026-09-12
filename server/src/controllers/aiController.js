const prisma = require("../config/db");
const { parseTaskFromText, computePriorityScore, generateDailyDigest } = require("../services/aiService");

async function parseAndCreateTask(req, res, next) {
  try {
    const { text, teamId } = req.body;
    const ownerId = req.user.userId;

    if (!text) {
      return res.status(400).json({ message: "Text input is required." });
    }

    const parsed = await parseTaskFromText(text);

    const priorityScore = computePriorityScore({
      dueDate: parsed.dueDate,
      estimatedMinutes: parsed.estimatedMinutes,
      aiPriority: parsed.priority,
    });

    const task = await prisma.task.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        priority: parsed.priority || "MEDIUM",
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        estimatedMinutes: parsed.estimatedMinutes,
        aiGenerated: true,
        ownerId,
        teamId: teamId ? Number(teamId) : null,
      },
    });

    res.status(201).json({ task, priorityScore, aiExtracted: parsed });
  } catch (err) {
    next(err);
  }
}




async function getDigest(req, res, next) {
  try {
    const userId = req.user.userId;

    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map((tm) => tm.teamId);

    const pendingTasks = await prisma.task.findMany({
      where: {
        status: { not: "DONE" },
        OR: [
          { ownerId: userId },
          { assignees: { some: { userId } } },
          { teamId: { in: teamIds } },
        ],
      },
      orderBy: { dueDate: "asc" },
    });

    // Attach a computed priority score to each task for context in the digest
    const tasksWithScores = pendingTasks.map((t) => ({
      ...t,
      priorityScore: computePriorityScore({
        dueDate: t.dueDate,
        estimatedMinutes: t.estimatedMinutes,
        aiPriority: t.priority,
      }),
    }));

    // Sort by score descending so the digest sees the most important tasks first
    tasksWithScores.sort((a, b) => b.priorityScore - a.priorityScore);

    const digest = await generateDailyDigest(tasksWithScores);

    res.json({
      digest,
      taskCount: tasksWithScores.length,
      topTasks: tasksWithScores.slice(0, 5).map((t) => ({
        id: t.id,
        title: t.title,
        priorityScore: t.priorityScore,
        dueDate: t.dueDate,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { parseAndCreateTask, getDigest };
