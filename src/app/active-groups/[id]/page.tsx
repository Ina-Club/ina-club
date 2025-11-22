
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Avatar,
  Button,
  CardMedia,
} from "@mui/material";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";
import ActiveGroupCard from "@/components/card/active-group-card";
import RequestGroupImages from "@/components/request-group/request-group-images";
import NotFound from "app/not-found";
import JoinButton from "@/components/join-button";
import UserAvatar from "@/components/user-avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ActiveGroupDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = await getServerSession(authOptions);

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
      participants: { //TODO: Fetch length instead
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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
  const mainImage = images[0] || "/InaClubLogo.png";
  const restImages = images.slice(1);
  const participantsCount = ag.participants.length;
  const participantAvatars = ag.participants.slice(0, 10).map((p) => ({
    id: p.user.id,
    name: p.user.name,
    email: p.user.email,
    imageUrl: p.user.profilePicture?.url || undefined,
  }));
  const viewerEmail = session?.user?.email;
  const alreadyJoined = !!viewerEmail
    ? ag.participants.some((p) => p.user.email === viewerEmail)
    : false;

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
              {participantAvatars.map((p) => (
                <UserAvatar
                  key={p.id}
                  name={p.name || p.email}
                  identifier={p.email || p.id}
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
            <JoinButton
              type="active-group"
              id={id}
              fullWidth
              isJoined={alreadyJoined}
            >
              הצטרף לקבוצה
            </JoinButton>
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
                  participants: s.participants.map((p: any) => ({
                    name: p.user.name,
                    mail: p.user.email,
                    image: p.user.profilePicture?.url || "",
                  })),
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
