import {
  Box,
  Typography,
  Paper,
  Stack,
  Skeleton,
} from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import GroupMembershipPanelSkeleton from "@/components/group-membership-button/group-membership-panel-skeleton";
import SimilarGroupsSkeleton from "@/components/skeleton/similar-groups-skeleton";

export default function LoadingActiveGroupDetail() {
  return (
    <>
      <DefaultPageBanner
        header="טוען פרטי קבוצה..."
        description="אנא המתן בזמן שאנו טוענים את כל המידע..."
      />
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          overflowWrap: "anywhere",
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          {/* Media + Description */}
          <Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              sx={{ borderRadius: 3 }}
            />

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={1}>
                <Skeleton width={100} />
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ lineHeight: 1.8 }}
              >
                <Skeleton width="100%" />
                <Skeleton width="90%" />
                <Skeleton width="95%" />
                <Skeleton width="80%" />
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={1}>
                <Skeleton width={150} />
              </Typography>
              <Skeleton variant="rounded" width="100%" height={60} />
            </Paper>
          </Box>

          {/* Right side – Price analysis, participants, CTA */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                position: { md: "sticky" },
                top: { md: 96 },
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={1}>
                <Skeleton width={120} />
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                <Skeleton width={180} />
                <Skeleton width={180} />
              </Typography>
              <GroupMembershipPanelSkeleton />
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SimilarGroupsSkeleton />
        </Box>
      </Box>
    </>
  );
}
