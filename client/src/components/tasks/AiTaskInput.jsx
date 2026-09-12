import { useState } from "react";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { parseTaskFromText } from "../../api/taskApi";

export default function AiTaskInput({ onTaskCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await parseTaskFromText(text);
      onTaskCreated(result.task);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not parse task. Try rephrasing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder='Try: "Finish the report by Friday, it&apos;s urgent, takes 2 hours"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{ whiteSpace: "nowrap" }}
        >
          {loading ? "Parsing..." : "Add with AI"}
        </Button>
      </Box>
    </Box>
  );
}