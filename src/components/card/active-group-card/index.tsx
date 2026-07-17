"use client";

import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";
import { ActiveGroup } from "lib/dal";
import { useState } from "react";
import ParticipantsProgress from "./participations-progress-bar";
import Countdown from "./countdown";
import { useRouter } from "next/navigation";
import { formatShekelAmount } from "@/lib/utils/currency";

interface ActiveGroupCardProps {
  activeGroup: ActiveGroup;
}

const ActiveGroupCard: React.FC<ActiveGroupCardProps> = ({ activeGroup }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  const goToActiveGroup = () => {
    router.push(`/active-groups/${activeGroup.id}`);
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(26,42,90,0.08)",
        flex: 1,
        overflowWrap: "anywhere",
        overflow: "hidden",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        border: "1px solid rgba(26,42,90,0.06)",
        opacity: activeGroup.status === "ACTIVATED" ? 0.65 : 1,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 28px rgba(26,42,90,0.14)",
          cursor: "pointer",
          opacity: activeGroup.status === "ACTIVATED" ? 0.85 : 1,
        },
      }}
      onClick={goToActiveGroup}
    >
      {/* Image — 65% aspect ratio */}
      <Box sx={{ position: "relative", pt: "65%", bgcolor: "grey.50" }}>
        <CardMedia
          component="img"
          image={activeGroup.images[currentImage]}
          alt={activeGroup.title}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {activeGroup.status === "ACTIVATED" && (
          <Chip
            label="הופעלה"
            color="success"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              fontWeight: 700,
              fontSize: "0.7rem",
              zIndex: 1,
            }}
          />
        )}

        {/* Floating Like button */}
        <GenericEntityLikeButton
          entity={activeGroup}
          type="active-group"
          sx={{ position: "absolute", top: 10, right: 10 }}
        />

        {/* Category Chip */}
        <Chip
          label={activeGroup.category}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(26,42,90,0.12)",
            color: "#1a2a5a",
            fontSize: "0.68rem",
            fontWeight: 500,
            px: 0.5,
          }}
        />

        {/* Dot navigation */}
        {activeGroup.images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.5,
            }}
          >
            {activeGroup.images.map((_, idx) => (
              <Box
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: idx === currentImage ? "primary.main" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  border: "1px solid white",
                  transition: "background-color 0.25s",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: "12px 14px 14px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Title */}
        <Typography
          noWrap
          sx={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.3, color: "#1a2a5a" }}
        >
          {activeGroup.title}
        </Typography>

        {/* Price row */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: "auto" }}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 700, color: "primary.main", lineHeight: 1 }}
          >
            {formatShekelAmount(activeGroup.groupPrice)}
          </Typography>
          <Typography
            sx={{ fontSize: "13px", color: "text.secondary", textDecoration: "line-through" }}
          >
            {formatShekelAmount(activeGroup.basePrice)}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary", ml: "auto" }}>
            / לאדם
          </Typography>
        </Box>

        {/* Countdown */}
        <Countdown
          deadline={activeGroup.deadline}
          sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", m: 0 }}
        />

        {/* Progress */}
        <ParticipantsProgress
          current={activeGroup.participantCount}
          min={activeGroup.minParticipants}
          max={activeGroup.maxParticipants}
        />
      </CardContent>
    </Card>
  );
};

export default ActiveGroupCard;
