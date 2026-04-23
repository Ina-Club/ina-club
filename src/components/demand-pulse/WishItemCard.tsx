"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { formatShekelAmount } from "@/lib/utils/currency";

export interface WishItemData {
  id: string;
  text: string;
  targetPrice: number | null;
  categoryName?: string;
  createdAt: string;
  authorName: string;
  authorAvatar: string | null;
  likeCount: number;
  isLikedByMe: boolean;
}

interface WishItemCardProps {
  item: WishItemData;
  onLikeToggle?: (id: string, liked: boolean) => void;
}

const TRENDING_THRESHOLD = 3;

export default function WishItemCard({ item, onLikeToggle }: WishItemCardProps) {
  const { isSignedIn } = useAuth(); // <- Clerk
  const router = useRouter();
  const [liked, setLiked] = useState(item.isLikedByMe);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const isTrending = likeCount >= TRENDING_THRESHOLD;

  const handleLike = async () => {
    if (!isSignedIn) {
      router.push("/sign-in"); // לנתיב של Clerk SignIn
      return;
    }

    // עדכון אופטימי
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => (newLiked ? prev + 1 : prev - 1));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      const res = await fetch(`/api/wish-items/${item.id}/like`, {
        method: "POST",
      });
      if (!res.ok) {
        // החזרת ערכים אם קרתה טעות
        setLiked(!newLiked);
        setLikeCount(prev => (newLiked ? prev - 1 : prev + 1));
      } else {
        onLikeToggle?.(item.id, newLiked);
      }
    } catch {
      setLiked(!newLiked);
      setLikeCount(prev => (newLiked ? prev - 1 : prev + 1));
    }
  };

  const timeAgo = (() => {
    const diff = Date.now() - new Date(item.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return "עכשיו";
    if (mins < 60) return `לפני ${mins} דקות`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${Math.floor(hours / 24)} ימים`;
  })();

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: isTrending
          ? "0 4px 20px rgba(255, 100, 50, 0.15)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        border: isTrending ? "1.5px solid rgba(255,140,50,0.35)" : "1.5px solid rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: isTrending
            ? "0 8px 28px rgba(255, 100, 50, 0.22)"
            : "0 6px 22px rgba(0,0,0,0.12)",
        },
      }}
    >
      {isTrending && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            height: "3px",
            background: "linear-gradient(90deg, #ff6b35, #f7c59f)",
          }}
        />
      )}

      <CardContent sx={{ p: "14px 16px 12px", "&:last-child": { pb: "12px" } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Avatar
            src={item.authorAvatar ?? undefined}
            sx={{ width: 28, height: 28, fontSize: "0.7rem", bgcolor: "primary.main" }}
          >
            {item.authorName.charAt(0)}
          </Avatar>
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            {item.authorName} · {timeAgo}
          </Typography>

          {isTrending && (
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: "13px !important" }} />}
              label="חם"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ff6b35, #f7c59f)",
                color: "white",
                "& .MuiChip-icon": { color: "white", ml: "4px" },
                "& .MuiChip-label": { px: "6px" },
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1.25,
            color: "text.primary",
          }}
        >
          {item.text}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
            {item.categoryName && (
              <Chip
                label={item.categoryName}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  bgcolor: "rgba(0,0,0,0.04)",
                  border: "none",
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
            )}
            {item.targetPrice && (
              <Chip
                label={`~${formatShekelAmount(item.targetPrice, { compact: true })}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  bgcolor: "#eef2ff",
                  color: "#4264d4",
                  border: "none",
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography
              variant="caption"
              color={liked ? "error" : "text.secondary"}
              sx={{ fontWeight: 500, minWidth: 18, textAlign: "center" }}
            >
              {likeCount}
            </Typography>
            <IconButton
              size="small"
              onClick={handleLike}
              sx={{
                p: "4px",
                color: liked ? "#e53935" : "text.secondary",
                transform: isAnimating ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.2s ease, color 0.2s ease",
                "&:hover": { color: "#e53935", bgcolor: "rgba(229,57,53,0.08)" },
              }}
            >
              {liked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
