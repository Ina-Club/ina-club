"use client";

import { Card, CardContent, Box, Skeleton, Chip } from "@mui/material";

export default function RequestGroupCardSkeleton() {
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
      <Box sx={{ position: "relative" }}>
        <Skeleton variant="rectangular" height={150} />
        <Chip
          label={<Skeleton width={60} />}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "grey.300",
          }}
        />
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={35} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="30%" height={16} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={40} />
      </CardContent>
    </Card>
  );
}


