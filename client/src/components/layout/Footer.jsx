import { Box, Typography, Container, Grid, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "background.default", py: 6, mt: 8 }}>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontFamily: "Fraunces, serif", mb: 1 }}>
              Taskline
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              A task manager that reads plain language and turns it into a plan.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Product</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink component={Link} to="/" sx={{ color: "background.default", opacity: 0.75 }}>Home</MuiLink>
              <MuiLink component={Link} to="/register" sx={{ color: "background.default", opacity: 0.75 }}>Get Started</MuiLink>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Company</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink component={Link} to="/contact" sx={{ color: "background.default", opacity: 0.75 }}>Contact</MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ opacity: 0.5, mt: 5 }}>
          Built by Ankit — a portfolio project demonstrating full-stack and AI integration.
        </Typography>
      </Container>
    </Box>
  );
}