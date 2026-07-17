"use client";

import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function WishItemCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        border: "1.5px solid rgba(0,0,0,0.06)",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: "14px 16px 12px",
          "&:last-child": { pb: "12px" },
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Author row: avatar + name/time + report icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="text" width="45%" height={16} />
          <Box sx={{ flex: 1 }} />
          <Skeleton variant="circular" width={22} height={22} />
        </Box>

        {/* Wish text — 2 lines */}
        <Skeleton variant="text" width="100%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1.25 }} />

        {/* Bottom row: chips + like button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: "11px" }} />
            <Skeleton variant="rounded" width={50} height={22} sx={{ borderRadius: "11px" }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Skeleton variant="text" width={18} height={16} />
            <Skeleton variant="circular" width={26} height={26} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
