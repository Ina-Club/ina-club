import {
  Box,
  Typography,
  Chip,
  Paper,
  Avatar,
  Button,
} from "@mui/material";
import { GroupStatus } from "lib/types/status";
import RequestGroupImages from "./request-group-images";
import UserAvatar from "@/components/user-avatar";
import FloatingLikeButton from "@/components/floating-like-button";

interface PreviewProps {
  title: string;
  description: string;
  category?: string;
  images: string[];
  participantsCount?: number;
  participantAvatars?: {
    id: string;
    name?: string;
    email?: string;
    imageUrl?: string;
    url?: string;
  }[];
  status?: GroupStatus;
}

export default function RequestGroupPreview({
  title,
  description,
  category,
  images,
  participantsCount = 0,
  participantAvatars = [],
  status = GroupStatus.OPEN,
}: PreviewProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* כותרת וקטגוריה */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {title || "כותרת הבקשה"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, md: 0 } }}>
          <Chip label={category || "קטגוריה"} size="small" />
        </Box>
      </Box>

      {/* מדיה עם אפשרות בחירה */}
      <RequestGroupImages images={images}>
        <FloatingLikeButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        />

      </RequestGroupImages>
      {/* תיאור */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} mb={1}>
          תיאור
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description || "—"}
        </Typography>
      </Paper>

      {/* סטטוס ומשתתפים */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          סטטוס: {status}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          {participantsCount} מעוניינים
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          {participantAvatars.map((p) => (
            <UserAvatar
              key={p.id}
              name={p.name || p.email}
              identifier={p.email || p.id}
              imageUrl={p.imageUrl ?? p.url}
              sx={{ width: 32, height: 32 }}
            />
          ))}
          {participantsCount > participantAvatars.length && (
            <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.300" }}>
              +{participantsCount - participantAvatars.length}
            </Avatar>
          )}
        </Box>
        <Button variant="contained" fullWidth disabled>
          הרשמה לקבוצה
        </Button>
      </Paper>
    </Box>
  );
}
