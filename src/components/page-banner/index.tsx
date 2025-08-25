import React from "react";
import { Box, Typography } from "@mui/material";

export const PageBanner: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#1a2a5a",
        color: "white",
        overflow: "hidden",
        background:
          "linear-gradient(140deg,rgba(255, 255, 255, 1) 0%, rgba(211, 224, 235, 1) 100%)",
        pt: { xs: 2, md: 4 }, // רק padding-top, כדי שהפילטרים יישבו על החצי התחתון
        pb: { xs: 10, md: 12 }, // מוסיפים מקום לפילטרים
        px: { xs: 2, md: 4 },
      }}
    >
      {/* רקעים מטושטשים */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 40,
            width: 288,
            height: 288,
            bgcolor: "#f0a868",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            right: 40,
            width: 384,
            height: 384,
            bgcolor: "#1a2a5a",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
      </Box>

      {/* תוכן */}
      <Box
        sx={{
          position: "relative",
          maxWidth: 1280,
          mx: "auto",
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { md: "3.75rem", xs: "2.4rem" },
            lineHeight: 1,
            mb: 2,
            color: "#1a2a5a",
          }}
        >
          כל הבקשות
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#1a2a5a",
            mb: 6,
            fontSize: { md: "1.5rem", xs: "1rem" },
          }}
        >
          גלה את כל הבקשות הפעילות, הצטרף לקבוצות קנייה וחסוך כסף יחד עם אחרים.
        </Typography>
      </Box>
    </Box>
  );
};
