import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
      <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto", py: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ fontFamily: "Fraunces, serif", fontWeight: 600, flexGrow: 1, color: "background.default" }}
        >
          Taskline
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button component={Link} to="/" sx={{ color: "background.default" }}>Home</Button>
          <Button component={Link} to="/contact" sx={{ color: "background.default" }}>Contact</Button>

          {user ? (
            <>
              <Button component={Link} to="/dashboard" sx={{ color: "background.default" }}>Dashboard</Button>
              <Button
                variant="outlined"
                onClick={() => { logout(); navigate("/"); }}
                sx={{ color: "background.default", borderColor: "background.default" }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: "background.default" }}>Log In</Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ bgcolor: "warning.main", color: "primary.main", "&:hover": { bgcolor: "#DD9418" } }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}