const ai = require("../config/gemini");

async function parseTaskFromText(text) {
  const today = new Date().toISOString().split("T")[0];

  const systemPrompt = `You are a task-parsing assistant. Extract structured task data from natural language.
Today's date is ${today}.
Respond ONLY with valid JSON, no other text, in this exact shape:
{
  "title": string,
  "description": string or null,
  "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  "dueDate": "YYYY-MM-DD" or null,
  "estimatedMinutes": number or null
}
If information isn't mentioned, use null for that field (except title, which is required and should be a short summary).`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\nUser input: ${text}` }] },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const raw = response.text;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("AI response was not valid JSON. Raw response: " + raw);
  }

  return parsed;
}

// computePriorityScore stays exactly the same — no changes needed
function computePriorityScore({ dueDate, estimatedMinutes, aiPriority, dependencyCount = 0 }) {
  let score = 0;

  if (dueDate) {
    const daysUntilDue = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysUntilDue <= 0) score += 40;
    else if (daysUntilDue <= 1) score += 35;
    else if (daysUntilDue <= 3) score += 25;
    else if (daysUntilDue <= 7) score += 15;
    else score += 5;
  }

  const priorityPoints = { URGENT: 30, HIGH: 22, MEDIUM: 12, LOW: 5 };
  score += priorityPoints[aiPriority] || 12;

  if (estimatedMinutes) {
    if (estimatedMinutes <= 30) score += 15;
    else if (estimatedMinutes <= 60) score += 10;
    else if (estimatedMinutes <= 180) score += 5;
  }

  score += Math.min(dependencyCount * 5, 15);

  return Math.min(Math.round(score), 100);
}

async function generateDailyDigest(tasks) {
  if (tasks.length === 0) {
    return "You have no pending tasks. Enjoy your day!";
  }

  const taskSummaries = tasks
    .map((t, i) => {
      const due = t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "no due date";
      return `${i + 1}. "${t.title}" — priority: ${t.priority}, status: ${t.status}, due: ${due}, priority score: ${t.priorityScore}`;
    })
    .join("\n");

  const prompt = `You are a productivity assistant. Given this list of a user's pending tasks, write a short, encouraging daily digest (3-5 sentences) telling them what to focus on today and why. Be specific about task names. Do not use markdown formatting, just plain text.

Tasks:
${taskSummaries}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { temperature: 0.5 },
  });

  return response.text;
}

module.exports = { parseTaskFromText, computePriorityScore, generateDailyDigest };
