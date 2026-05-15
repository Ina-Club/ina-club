import { Box, Skeleton } from "@mui/material";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";

export default function SimilarGroupsSkeleton() {
  return (
    <Box sx={{ mt: 6 }}>
      <Skeleton variant="text" sx={{ mb: 2 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <ActiveGroupCardSkeleton key={i} />
        ))}
      </Box>
    </Box>
  );
}
