import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import RequestGroupCard from "@/components/card/request-group-card";
import { GroupStatus } from "lib/types/status";
import GroupImages from "@/components/group-images/group-images";
import NotFound from "app/not-found";
import GroupMembershipButton from "@/components/group-membership-button";
import UserAvatar from "@/components/user-avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserIsRequestGroupParticipant } from "@/lib/utils/praticipant";
import { fetchRequestGroups } from "@/lib/groups";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";

export default async function RequestGroupDetail({ params, }: { params: { id: string }; }) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  const rg = (await fetchRequestGroups({ id }))?.[0] ?? null;
  if (!rg) {
    return (
      <NotFound />
    );
  }

  const participantsCount = rg.participants.length;
  const participantAvatars = rg.participants.slice(0, 10).map((p) => ({
    name: p.firstName || null,
    imageUrl: p.image || undefined,
  }));
  const viewerEmail = session?.user?.email;
  const alreadyJoined = !!viewerEmail ? await checkUserIsRequestGroupParticipant(viewerEmail, rg.id) : false;
  const similarGroups = await fetchRequestGroups({ category: { name: rg.category ?? "" }, NOT: { id } }, 3);

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
          {rg.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, md: 0 } }}>
          <Chip label={rg.category || "קטגוריה"} size="small" />
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
          <GroupImages images={rg.images}>
            <GenericEntityLikeButton
              entity={rg}
              type="request-group"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
              }}
            />
          </GroupImages>
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
            <Typography variant="subtitle2">
              {participantsCount} אנשים כבר אהבו את הבקשה!
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
              type="request-group"
              id={id}
              fullWidth
              isJoined={alreadyJoined}
            />
          </Paper>
        </Box>
      </Box>

      {similarGroups.length > 0 && (
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
            {similarGroups.map((s) => (
              <RequestGroupCard
                key={s.id}
                requestGroup={{
                  id: s.id,
                  title: s.title,
                  description: undefined,
                  category: s.category,
                  images: s.images ?? ["/InaClubLogo.png"],
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
