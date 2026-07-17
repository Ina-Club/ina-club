"use client";

import { Card, CardContent, Box, Skeleton, Chip } from "@mui/material";

export default function ActiveGroupCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(26,42,90,0.08)",
        border: "1px solid rgba(26,42,90,0.06)",
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Image — matches 65% aspect ratio */}
      <Box sx={{ position: "relative", pt: "65%" }}>
        <Skeleton
          variant="rectangular"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <Chip
          label={<Skeleton width={56} />}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: "12px 14px 14px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Title */}
        <Skeleton variant="text" width="65%" height={26} />

        {/* Price row */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: "auto" }}>
          <Skeleton variant="text" width="30%" height={32} />
          <Skeleton variant="text" width="20%" height={18} />
        </Box>

        {/* Countdown */}
        <Skeleton variant="text" width="45%" height={18} />

        {/* Progress label + bar */}
        <Skeleton variant="text" width="55%" height={16} />
        <Skeleton variant="rounded" height={4} sx={{ borderRadius: 4 }} />
      </CardContent>
    </Card>
  );
}
