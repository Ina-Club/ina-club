
import { Suspense } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupStatus } from "lib/types/status";
import GroupImages from "@/components/group-images/group-images";
import NotFound from "app/not-found";
import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchActiveGroups } from "@/lib/groups";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";
import ParticipantsProgress from "@/components/card/active-group-card/participations-progress-bar";
import GroupMembershipPanelLoader from "@/components/group-membership-button/group-membership-panel-loader";
import GroupMembershipPanelSkeleton from "@/components/group-membership-button/group-membership-panel-skeleton";
import SimilarGroupsLoader from "@/components/similar-groups/similar-groups-loader";
import SimilarGroupsSkeleton from "@/components/skeleton/similar-groups-skeleton";
import { formatShekelAmount } from "@/lib/utils/currency";
import CompanyCardLoader from "@/components/company-card-loader/company-card-loader";
import CompanyCardSkeleton from "@/components/skeleton/company-card-skeleton";

export default async function ActiveGroupDetail({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  const ag = (await fetchActiveGroups({ whereData: { id }, includeDetails: true }))?.[0] ?? null;
  if (!ag) {
    return (
      <NotFound />
    );
  }

  const currentUserForPanel = userId && user
    ? {
        firstName: user.firstName ?? "משתמש",
        image: user.imageUrl ?? "",
      }
    : null;

  return (
    <>
      <DefaultPageBanner
        header={ag.title}
        description="פרטי קבוצה, הצטרפות וקבוצות דומות"
                hintBullets={[
          "בודקים מחיר ליחידה מול מחיר קבוצתי ואת מספר המשתתפים הנדרש.",
          "מצטרפים דרך הלוח בצד (נדרש להתחבר).",
          "אפשר לסמן לייק על הקבוצה כדי לעזור לאחרים לגלות אותה.",
        ]}
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
          <Chip label={ag.category || "קטגוריה"} size="small" variant="outlined" />
          {ag.status === GroupStatus.ACTIVATED && (
            <Chip label="קבוצה הופעלה" color="success" size="small" />
          )}
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
          <GroupImages images={ag.images}>
            <GenericEntityLikeButton
              entity={ag}
              type="active-group"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
              }}
            />
          </GroupImages>

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
              על המוצר
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              {ag.description || "—"}
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
              סטטוס רשומים
            </Typography>
            <ParticipantsProgress
              current={ag.participantCount}
              min={ag.minParticipants}
              max={ag.maxParticipants}
            />
          </Paper>
        </Box>

        {/* Right side – Price analysis, participants, CTA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                מחיר יחידה: {formatShekelAmount(ag.basePrice)}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                מחיר קבוצתי: {formatShekelAmount(ag.groupPrice)}
              </Typography>
            </Box>
            <Suspense fallback={<GroupMembershipPanelSkeleton />}>
              <GroupMembershipPanelLoader
                groupId={id}
                userId={userId}
                currentUser={currentUserForPanel}
                status={ag.status}
                businessRegistrationTerms={ag.registrationTerms}
              />
            </Suspense>
          </Paper>

          {ag.companyId && (
            <Box>
              <Suspense fallback={<CompanyCardSkeleton />}>
                <CompanyCardLoader companyId={ag.companyId} />
              </Suspense>
            </Box>
          )}
        </Box>
      </Box>

      <Suspense fallback={<SimilarGroupsSkeleton />}>
        <SimilarGroupsLoader
          category={ag.category ?? ""}
          excludeId={id}
        />
      </Suspense>
      </Box>
    </>
  );
}
