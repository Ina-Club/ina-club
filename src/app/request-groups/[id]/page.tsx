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
import RequestGroupCard from "@/components/card/request-group-card";
import { GroupStatus } from "lib/types/status";
import RequestGroupImages from "@/components/request-group/request-group-images";
import NotFound from "app/not-found";

export default async function RequestGroupDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const rg = await prisma.requestGroup.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      categoryId: true,
      category: { select: { name: true } },
      images: {
        select: { image: { select: { url: true } }, order: true },
        orderBy: { order: "asc" },
      },
      participants: {
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
    },
  });

  if (!rg) {
    return (
      <NotFound />
    );
  }

  const images = rg.images.map((i) => i.image.url);
  const mainImage = images[0] || "/InaClubLogo.png";
  const restImages = images.slice(1);
  const participantsCount = rg.participants.length;
  const participantAvatars = rg.participants.slice(0, 10).map((p) => ({
    id: p.user.id,
    name: p.user.name || p.user.email,
    url: p.user.profilePicture?.url || undefined,
  }));

  // Similar items
  const similar = await prisma.requestGroup.findMany({
    where: { categoryId: rg.categoryId ?? undefined, NOT: { id } },
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
          {rg.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, md: 0 } }}>
          <Chip label={rg.category?.name || "קטגוריה"} size="small" />
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
        {/* מדיה + תיאור */}
        <Box>
          <RequestGroupImages images={images}></RequestGroupImages>
          {/* <Paper elevation={0} sx={{ p: 0, overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardMedia component="img" image={mainImage} alt="main" sx={{ width: '100%', height: { xs: 240, md: 460 }, objectFit: 'cover' }} />
            {restImages.length > 0 && (
              <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                {restImages.map((url, i) => (
                  <CardMedia key={i} component="img" image={url} alt={`thumb-${i}`} sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 1.5 }} />
                ))}
              </Box>
            )}
          </Paper> */}

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
              {rg.description || "—"}
            </Typography>
          </Paper>
        </Box>

        {/* צד ימין – ניתוח מחיר, משתתפים, CTA */}
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
              ניתוח מחיר משוער
            </Typography>
            <Typography variant="body2" color="text.secondary">
              בהסתמך על ביקוש של כ-{participantsCount || 0} משתתפים, ניתן לצפות
              להנחת כמות בסדר גודל של 5%‑15% לעומת מחיר יחידה רגיל. ככל שמספר
              המשתתפים יעלה, כך פוטנציאל ההנחה גדל.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              סטטוס: {rg.status}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              מעוניינים
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
                <Avatar
                  key={p.id}
                  src={p.url}
                  alt={p.name}
                  sx={{ width: 36, height: 36 }}
                >
                  {!p.url ? p.name.charAt(0) : null}
                </Avatar>
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
            <Button variant="contained" color="primary" fullWidth>
              הרשמה לקבוצה
            </Button>
          </Paper>
        </Box>
      </Box>

      {similar.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            מומלץ עבורך • פריטים דומים
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {similar.map((s) => (
              <RequestGroupCard
                key={s.id}
                requestGroup={{
                  id: s.id,
                  title: s.title,
                  description: undefined,
                  category: s.category?.name || "",
                  images: s.images.length
                    ? s.images.map((i) => i.image.url)
                    : ["/InaClubLogo.png"],
                  participants: [],
                  openedGroups: [],
                  status: GroupStatus.OPEN,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
