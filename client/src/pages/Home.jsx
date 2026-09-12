import { useState } from "react";
import { Box, Container, Typography, Button, Grid, Paper, Chip, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const steps = [
  {
    n: "1",
    title: "Type it like you'd say it",
    body: `"Finish the client report by Friday, it's urgent, takes about 2 hours." No forms, no dropdowns.`,
  },
  {
    n: "2",
    title: "It becomes a real task",
    body: "Title, due date, priority, and time estimate get pulled out automatically and saved.",
  },
  {
    n: "3",
    title: "Your day gets ranked for you",
    body: "A scoring algorithm weighs urgency, effort, and what's blocking other work — then tells you what to do first.",
  },
];

const features = [
  { title: "Team & personal tasks", body: "Keep solo to-dos and shared team work in one list, without mixing them up." },
  { title: "Task dependencies", body: "Mark a task as blocked by another — it can't be closed out until its dependency is done." },
  { title: "Daily focus digest", body: "A short written summary each morning of what actually matters today." },
];

export default function Home() {
  const [demoText] = useState('Finish the client report by Friday, it\'s urgent, takes 2 hours');

  return (
    <Box>
      <NavBar />

      {/* Hero */}
      <Container maxWidth="md" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" }, lineHeight: 1.15, mb: 2 }}>
              Write it down.
              <br />
              Let it plan itself.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
              Taskline turns a plain sentence into a scheduled, prioritized task — then tells you what to focus on today.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button component={Link} to="/register" variant="contained" size="large" color="primary">
                Get Started Free
              </Button>
              <Button component={Link} to="/contact" variant="outlined" size="large" color="primary">
                Ask a Question
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "rgba(22,35,58,0.12)",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="caption" color="text.secondary">You type</Typography>
              <Box
                sx={{
                  p: 1.5,
                  mt: 0.5,
                  mb: 2.5,
                  bgcolor: "background.default",
                  fontFamily: "monospace",
                  fontSize: 14,
                  borderRadius: 1,
                }}
              >
                {demoText}
              </Box>

              <Typography variant="caption" color="text.secondary">Taskline creates</Typography>
              <Box sx={{ mt: 1, p: 2, border: "1px solid rgba(22,35,58,0.1)", borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>Finish the client report</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Chip label="URGENT" size="small" sx={{ bgcolor: "error.main", color: "#fff" }} />
                  <Chip label="Due Fri" size="small" variant="outlined" />
                  <Chip label="~2 hrs" size="small" variant="outlined" />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
                  Priority score: 75/100
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 5 }}>How it works</Typography>
          <Grid container spacing={4}>
            {steps.map((s) => (
              <Grid item xs={12} md={4} key={s.n}>
                <Typography variant="h3" color="warning.main" sx={{ mb: 1, fontSize: "2rem" }}>
                  {s.n}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">{s.body}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features as index cards */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ mb: 5 }}>What's inside</Typography>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={4} key={f.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid rgba(22,35,58,0.1)",
                  transform: `rotate(${i === 1 ? "0deg" : i === 0 ? "-0.6deg" : "0.6deg"})`,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.body}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA band */}
      <Box sx={{ bgcolor: "primary.main", color: "background.default", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 2, color: "background.default" }}>
            Start writing your list the way you already think.
          </Typography>
          <Button component={Link} to="/register" variant="contained" size="large" sx={{ bgcolor: "warning.main", color: "primary.main", mt: 2, "&:hover": { bgcolor: "#DD9418" } }}>
            Create a free account
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}