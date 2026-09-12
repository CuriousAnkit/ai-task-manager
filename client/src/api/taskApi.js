import axiosInstance from "./axiosInstance";

export async function getTasks() {
  const res = await axiosInstance.get("/tasks");
  return res.data.tasks;
}

export async function getTaskById(id) {
  const res = await axiosInstance.get(`/tasks/${id}`);
  return res.data.task;
}

export async function createTask(data) {
  const res = await axiosInstance.post("/tasks", data);
  return res.data.task;
}

export async function updateTask(id, data) {
  const res = await axiosInstance.put(`/tasks/${id}`, data);
  return res.data.task;
}

export async function deleteTask(id) {
  const res = await axiosInstance.delete(`/tasks/${id}`);
  return res.data;
}

export async function parseTaskFromText(text, teamId) {
  const res = await axiosInstance.post("/ai/parse-task", { text, teamId });
  return res.data;
}

export async function getDailyDigest() {
  const res = await axiosInstance.get("/ai/digest");
  return res.data;
}