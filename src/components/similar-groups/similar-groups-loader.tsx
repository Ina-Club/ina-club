import { Box, Typography } from "@mui/material";
import ActiveGroupCard from "@/components/card/active-group-card";
import { fetchActiveGroups } from "@/lib/groups";
import { GroupStatus } from "lib/types/status";

const SIMILAR_GROUPS_COUNT = 3;

interface SimilarGroupsLoaderProps {
  category: string;
  excludeId: string;
}

/** Async server component — streamed via Suspense */
export default async function SimilarGroupsLoader({
  category,
  excludeId,
}: SimilarGroupsLoaderProps) {
  const similarGroups = await fetchActiveGroups({
    whereData: { status: GroupStatus.OPEN, category: { name: category }, NOT: { id: excludeId } },
    take: SIMILAR_GROUPS_COUNT,
  });

  if (similarGroups.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        מומלץ עבורך • קבוצות דומות
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {similarGroups.map((group, index) => (
          <ActiveGroupCard
            key={index}
            activeGroup={group}
          />
        ))}
      </Box>
    </Box>
  );
}
