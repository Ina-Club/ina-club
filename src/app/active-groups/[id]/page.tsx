
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";
import ActiveGroupCard from "@/components/card/active-group-card";
import RequestGroupImages from "@/components/request-group/request-group-images";
import NotFound from "app/not-found";
import GroupMembershipButton from "@/components/group-membership-button";
import UserAvatar from "@/components/user-avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserIsActiveGroupParticipant } from "@/lib/utils/praticipant";

export default async function ActiveGroupDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // TODO: Move this somewhere else and make sure no Name and Email are being fetched!
  const ag = await prisma.activeGroup.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      categoryId: true,
      category: { select: { name: true } },
      basePrice: true,
      groupPrice: true,
      minParticipants: true,
      maxParticipants: true,
      deadline: true,
      createdAt: true,
      company: {
        select: { id: true, title: true, logo: { select: { url: true } } },
      },
      participants: {
        select: {
          user: {
            select: {
              name: true,
              profilePicture: { select: { url: true } },
            },
          },
        },
      },
      images: {
        select: { image: { select: { url: true } }, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!ag) {
    return (
      <NotFound />
    );
  }

  const images = ag.images.map((i) => i.image.url);
  const participantsCount = ag.participants.length;
  const participantAvatars = ag.participants.slice(0, 10).map((p) => ({
    name: !!p.user.name ? p.user.name.split(" ")[0] : null, // This way we avoid sending full user names to the client.
    imageUrl: p.user.profilePicture?.url || undefined,
  }));
  const viewerEmail = session?.user?.email;
  const alreadyJoined = !!viewerEmail ? await checkUserIsActiveGroupParticipant(viewerEmail, ag.id) : false;

  // Similar ActiveGroups
  const similar = await prisma.activeGroup.findMany({
    where: { categoryId: ag.categoryId ?? undefined, NOT: { id } },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      images: {
        select: { image: { select: { url: true } }, order: true },
        orderBy: { order: "asc" },
      },
      category: { select: { name: true } },
      groupPrice: true,
      basePrice: true,
      participants: true,
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
        overflowWrap: "anywhere",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight={800} color="primary">
          {ag.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, md: 0 } }}>
          <Chip label={ag.category?.name || "קטגוריה"} size="small" />
        </Box>
      </Box>

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
          <RequestGroupImages images={images}></RequestGroupImages>

          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={1.5}>
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
              מחיר יחידה: ₪{ag.basePrice} <br />
              מחיר קבוצתי: ₪{ag.groupPrice} <br />
              סטטוס: {ag.status}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              משתתפים
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              {participantAvatars.map((p, index) => (
                <UserAvatar
                  key={index}
                  name={p.name}
                  identifier={index.toString()}
                  imageUrl={p.imageUrl}
                  sx={{ width: 36, height: 36 }}
                />
              ))}
              {participantsCount > participantAvatars.length && (
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "grey.300",
                    color: "text.primary",
                  }}
                >
                  +{participantsCount - participantAvatars.length}
                </Avatar>
              )}
            </Box>
            <GroupMembershipButton
              type="active-group"
              id={id}
              fullWidth
              isJoined={alreadyJoined}
            />
          </Paper>
        </Box>
      </Box>

      {similar.length > 0 && (
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
            {similar.map((s) => (
              <ActiveGroupCard
                key={s.id}
                activeGroup={{
                  id: s.id,
                  title: s.title,
                  description: undefined,
                  category: s.category?.name || "",
                  images: s.images.length
                    ? s.images.map((i) => i.image.url)
                    : ["/InaClubLogo.png"],
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
  );
}
