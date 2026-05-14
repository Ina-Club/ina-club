import { Box, Divider, Skeleton } from "@mui/material";

export default function GroupMembershipPanelSkeleton() {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
      <Box sx={{ display: "flex", gap: 0.75, mb: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="circular" width={36} height={36} />
        ))}
      </Box>
      <Skeleton variant="rounded" width="100%" height={42} sx={{ mt: 2, borderRadius: 1 }} />
    </>
  );
}
