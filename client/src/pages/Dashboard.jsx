import { useEffect, useState } from "react";
import { Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskDialog from "../components/tasks/CreateTaskDialog";
import AiTaskInput from "../components/tasks/AiTaskInput";
import DigestWidget from "../components/tasks/DigestWidget";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(taskData) {
    const newTask = await createTask(taskData);
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleAiTaskCreated(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleStatusChange(taskId, status) {
    try {
      const updated = await updateTask(taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update task status.");
    }
  }

  async function handleDelete(taskId) {
    if (!confirm("Delete this task?")) return;
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Welcome, {user?.name}</Typography>
        <Button variant="outlined" onClick={logout}>Log Out</Button>
      </Box>

      <DigestWidget />

      <AiTaskInput onTaskCreated={handleAiTaskCreated} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Your Tasks</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New Task
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet. Create one above!</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))
      )}

      <CreateTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </Container>
  );
}