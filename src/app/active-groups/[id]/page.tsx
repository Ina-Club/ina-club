
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupStatus } from "lib/types/status";
import ActiveGroupCard from "@/components/card/active-group-card";
import GroupImages from "@/components/group-images/group-images";
import NotFound from "app/not-found";
import { auth, currentUser } from "@clerk/nextjs/server";
import { checkUserIsActiveGroupParticipant } from "@/lib/utils/praticipant";
import { fetchActiveGroups } from "@/lib/groups";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";
import { LikeTargetType } from "@/lib/types/like";
import { fetchGroupLikeCount } from "@/lib/groups";
import ParticipantsProgress from "@/components/card/active-group-card/participations-progress-bar";
import GroupMembershipPanel from "@/components/group-membership-button/group-membership-panel";
import { formatShekelAmount } from "@/lib/utils/currency";

export default async function ActiveGroupDetail({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  const ag = (await fetchActiveGroups({ id }))?.[0] ?? null;
  if (!ag) {
    return (
      <NotFound />
    );
  }

  const alreadyJoined = !!userId ? await checkUserIsActiveGroupParticipant(userId, ag.id) : false;
  const similarGroups = await fetchActiveGroups({ category: { name: ag.category ?? "" }, NOT: { id } }, 3);
  const likeCount = await fetchGroupLikeCount(ag.id, LikeTargetType.ACTIVE_GROUP);
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
              תיאור
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
              current={ag.participants.length}
              min={ag.minParticipants}
              max={ag.maxParticipants}
            />
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
              ניתוח מחיר
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מחיר יחידה: {formatShekelAmount(ag.basePrice)} <br />
              מחיר קבוצתי: {formatShekelAmount(ag.groupPrice)} <br />
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">
              {likeCount} אנשים כבר סימנו בלייק את הקבוצה!
            </Typography>
            <GroupMembershipPanel
              groupId={id}
              initialParticipants={ag.participants}
              currentUser={currentUserForPanel}
              isJoined={alreadyJoined}
              status={ag.status}
            />
          </Paper>
        </Box>
      </Box>

      {similarGroups.length > 0 && (
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
            {similarGroups.map((s) => (
              <ActiveGroupCard
                key={s.id}
                activeGroup={{
                  id: s.id,
                  title: s.title,
                  description: undefined,
                  category: s.category,
                  images: s.images ?? ["/InaClubLogo.png"],
                  participants: [],
                  status: GroupStatus.OPEN,
                  basePrice: s.basePrice,
                  groupPrice: s.groupPrice,
                  deadline: new Date(),
                  createdAt: new Date(),
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      </Box>
    </>
  );
}
