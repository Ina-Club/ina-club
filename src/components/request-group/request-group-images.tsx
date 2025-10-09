"use client";
import { useState } from "react";
import { Box, CardMedia, IconButton, Paper } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface Props {
  images: string[];
}

export default function RequestGroupImages({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];
  const hasMultiple = images.length > 1;


  const handleNext = () =>
    setSelectedIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardMedia
        component="img"
        image={mainImage}
        alt="main"
        sx={{ width: "100%", height: 300, objectFit: "cover" }}
      />

      {hasMultiple && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ArrowForward />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ArrowBack />
          </IconButton>
        </>
      )}

      {/* thumbnails לבחירה */}
      {hasMultiple && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 1,
            overflowX: "auto",
            justifyContent: "center",
            bgcolor: "grey.50",
          }}
        >
          {images.map((url, i) => (
            <Box
              key={i}
              onClick={() => setSelectedIndex(i)}
              sx={{
                borderRadius: 1,
                cursor: "pointer",
                border:
                  selectedIndex === i
                    ? "2px solid #1976d2"
                    : "2px solid transparent",
                transition: "0.2s",
              }}
            >
              <CardMedia
                component="img"
                image={url}
                alt={`thumb-${i}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
