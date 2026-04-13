"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        py: 8,
      }}
    >
      <Typography variant="h3" component="h1" color="text.primary">
        הדף לא נמצא
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.7 }}>
        ייתכן שהקישור ישן או שהדף הוזז.
      </Typography>
      <Button component={Link} href="/" variant="contained" color="primary" sx={{ borderRadius: 2, px: 3 }}>
        חזרה לדף הבית
      </Button>
    </Box>
  );
}

