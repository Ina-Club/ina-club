import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Avatar,
  Button,
  CardMedia,
  IconButton,
} from "@mui/material";
import { GroupStatus } from "lib/types/status";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import RequestGroupImages from "./request-group-images";

interface PreviewProps {
  title: string;
  description: string;
  category?: string;
  images: string[];
  participantsCount?: number;
  participantAvatars?: { id: string; name: string; url?: string }[];
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
      <RequestGroupImages images={images} />
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
            <Avatar key={p.id} src={p.url} sx={{ width: 32, height: 32 }}>
              {!p.url ? p.name.charAt(0) : null}
            </Avatar>
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
