import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint for this yet — placeholder confirmation only.
    setSent(true);
  }

  return (
    <Box>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Get in touch</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Questions, feedback, or bug reports — send a note below.
        </Typography>

        {sent && <Alert severity="success" sx={{ mb: 3 }}>Message received. This is a portfolio demo, so nothing is sent yet — but the form works.</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" fullWidth required value={form.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" fullWidth required value={form.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Message" name="message" fullWidth required multiline rows={5} value={form.message} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large">Send Message</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Footer />
    </Box>
  );
}