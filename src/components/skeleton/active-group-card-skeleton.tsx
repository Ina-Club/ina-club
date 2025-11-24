"use client";

import { Card, CardContent, Box, Skeleton, Chip } from "@mui/material";

export default function ActiveGroupCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <Skeleton variant="rectangular" height={150} />

        {/* Category Chip */}
        <Chip
          label={<Skeleton width={60} />}
          size="small"
          sx={{
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "grey.300",
            color: "grey",
            position: "absolute",
            px: 1,
          }}
        />

        {/* Dots */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 0.5,
          }}
        >
          {Array.from({ length: 3 }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.7)",
                border: "1px solid white",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <Skeleton variant="text" width="60%" height={35} sx={{ mb: 1 }} />

        {/* Price Section */}
        <Skeleton variant="text" width="20%" height={18} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="25%" height={24} sx={{ mb: 2 }} />

        {/* Countdown */}
        <Skeleton variant="text" width="20%" height={18} sx={{ mb: 1 }} />

        {/* Participants */}
        <Skeleton variant="text" width="30%" height={18} sx={{ mb: 1 }} />

        {/* Gauge */}
        <Skeleton variant="rounded" height={10} />
      </CardContent>
    </Card>
  );
}
