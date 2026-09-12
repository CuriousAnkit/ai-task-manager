import { Card, CardContent, Typography, Chip, Box, IconButton, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const priorityColors = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "error",
};

const statusOptions = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"];

export default function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{task.title}</Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mt: 1 }}>
              <Chip label={task.priority} color={priorityColors[task.priority]} size="small" />
              {task.dueDate && (
                <Chip
                  label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {task.aiGenerated && <Chip label="AI Generated" size="small" color="secondary" />}
              {task.team && <Chip label={task.team.name} size="small" variant="outlined" />}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Select
              value={task.status}
              size="small"
              onChange={(e) => onStatusChange(task.id, e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
            <IconButton color="error" onClick={() => onDelete(task.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}