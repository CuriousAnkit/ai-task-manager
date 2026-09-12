const prisma = require("../config/db");

// Helper: check if user can access a task (owner, assignee, or same team)
async function canAccessTask(task, userId) {
  if (task.ownerId === userId) return true;
  if (task.assignees.some((a) => a.userId === userId)) return true;
  if (task.teamId) {
    const membership = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId: task.teamId } },
    });
    if (membership) return true;
  }
  return false;
}

async function createTask(req, res, next) {
  try {
    const { title, description, priority, dueDate, estimatedMinutes, teamId, categoryIds } = req.body;
    const ownerId = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    // If teamId provided, confirm the user is actually a member of that team
    if (teamId) {
      const membership = await prisma.teamMember.findUnique({
        where: { userId_teamId: { userId: ownerId, teamId: Number(teamId) } },
      });
      if (!membership) {
        return res.status(403).json({ message: "You are not a member of this team." });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedMinutes: estimatedMinutes || null,
        ownerId,
        teamId: teamId ? Number(teamId) : null,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({ categoryId: Number(categoryId) })),
            }
          : undefined,
      },
      include: { categories: { include: { category: true } }, assignees: true },
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

async function getTasks(req, res, next) {
  try {
    const userId = req.user.userId;

    // Tasks the user owns, is assigned to, or that belong to teams they're in
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map((tm) => tm.teamId);

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { assignees: { some: { userId } } },
          { teamId: { in: teamIds } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        assignees: { include: { user: { select: { id: true, name: true, email: true } } } },
        categories: { include: { category: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        assignees: { include: { user: { select: { id: true, name: true, email: true } } } },
        categories: { include: { category: true } },
        team: true,
        dependsOn: { include: { dependencyTask: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const hasAccess = await canAccessTask(task, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "You do not have access to this task." });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignees: true },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const hasAccess = await canAccessTask(existingTask, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "You do not have access to this task." });
    }

    const { title, description, status, priority, dueDate, estimatedMinutes } = req.body;

    if (status === "DONE") {
      const incompleteDeps = await checkDependenciesComplete(taskId);
      if (incompleteDeps.length > 0) {
        return res.status(400).json({
          message: "Cannot mark task as done — incomplete dependencies remain.",
          incompleteDependencies: incompleteDeps.map((d) => ({
            id: d.dependencyTask.id,
            title: d.dependencyTask.title,
            status: d.dependencyTask.status,
          })),
        });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(estimatedMinutes !== undefined && { estimatedMinutes }),
      },
      include: { categories: { include: { category: true } }, assignees: true },
    });

    res.json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Only the owner can delete a task
    if (task.ownerId !== userId) {
      return res.status(403).json({ message: "Only the task owner can delete this task." });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: "Task deleted." });
  } catch (err) {
    next(err);
  }
}

// Add a dependency: dependentTaskId is blocked by dependencyTaskId
async function addDependency(req, res, next) {
  try {
    const dependentTaskId = Number(req.params.id);
    const { dependencyTaskId } = req.body;
    const userId = req.user.userId;

    if (!dependencyTaskId) {
      return res.status(400).json({ message: "dependencyTaskId is required." });
    }
    if (Number(dependencyTaskId) === dependentTaskId) {
      return res.status(400).json({ message: "A task cannot depend on itself." });
    }

    const dependentTask = await prisma.task.findUnique({
      where: { id: dependentTaskId },
      include: { assignees: true },
    });
    if (!dependentTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const hasAccess = await canAccessTask(dependentTask, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "You do not have access to this task." });
    }

    const dependencyTask = await prisma.task.findUnique({
      where: { id: Number(dependencyTaskId) },
    });
    if (!dependencyTask) {
      return res.status(404).json({ message: "Dependency task not found." });
    }

    // Prevent circular dependencies: check if dependencyTask already (transitively) depends on dependentTask
    const wouldCreateCycle = await checkForCycle(Number(dependencyTaskId), dependentTaskId);
    if (wouldCreateCycle) {
      return res.status(400).json({ message: "This would create a circular dependency." });
    }

    const dependency = await prisma.taskDependency.create({
      data: {
        dependentTaskId,
        dependencyTaskId: Number(dependencyTaskId),
      },
      include: { dependencyTask: true },
    });

    res.status(201).json({ dependency });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "This dependency already exists." });
    }
    next(err);
  }
}

// Recursive check: does `taskId` transitively depend on `targetId`?
async function checkForCycle(taskId, targetId, visited = new Set()) {
  if (taskId === targetId) return true;
  if (visited.has(taskId)) return false;
  visited.add(taskId);

  const dependencies = await prisma.taskDependency.findMany({
    where: { dependentTaskId: taskId },
    select: { dependencyTaskId: true },
  });

  for (const dep of dependencies) {
    const found = await checkForCycle(dep.dependencyTaskId, targetId, visited);
    if (found) return true;
  }
  return false;
}

async function removeDependency(req, res, next) {
  try {
    const dependentTaskId = Number(req.params.id);
    const dependencyId = Number(req.params.dependencyId);
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id: dependentTaskId },
      include: { assignees: true },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const hasAccess = await canAccessTask(task, userId);
    if (!hasAccess) {
      return res.status(403).json({ message: "You do not have access to this task." });
    }

    await prisma.taskDependency.delete({ where: { id: dependencyId } });

    res.json({ message: "Dependency removed." });
  } catch (err) {
    next(err);
  }
}

// Block moving a task to DONE if it has incomplete dependencies
async function checkDependenciesComplete(taskId) {
  const dependencies = await prisma.taskDependency.findMany({
    where: { dependentTaskId: taskId },
    include: { dependencyTask: true },
  });

  const incomplete = dependencies.filter((d) => d.dependencyTask.status !== "DONE");
  return incomplete;
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addDependency,
  removeDependency,
  checkDependenciesComplete,
};
