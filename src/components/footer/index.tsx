"use client";

import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #1976d2, #42a5f5)", // גרדיאנט כמו בהדר
        color: "white",
        py: 3,
        mt: "auto",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        {/* טקסט זכויות */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} כל הזכויות שמורות לחברת Ina Innovations. 
        </Typography>

        {/* לינקים שימושיים */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/privacy" underline="hover" color="inherit">
            מדיניות פרטיות
          </Link>
          <Link href="/contact" underline="hover" color="inherit">
            צור קשר
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
