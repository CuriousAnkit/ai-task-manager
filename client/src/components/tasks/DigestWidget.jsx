import { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { getDailyDigest } from "../../api/taskApi";

export default function DigestWidget() {
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyDigest()
      .then((data) => setDigest(data.digest))
      .catch(() => setDigest("Could not load your daily digest."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card sx={{ mb: 3, bgcolor: "#e3f2fd" }}>
      <CardContent>
        <Typography variant="subtitle2" color="primary" fontWeight={600} mb={1}>
          Today's Focus
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Typography variant="body2">{digest}</Typography>
        )}
      </CardContent>
    </Card>
  );
}