"use client";

import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";
import { ActiveGroup } from "lib/dal";
import { useState } from "react";
import ParticipantsProgress from "./participations-progress-bar";
import Countdown from "./countdown";
import { useRouter } from "next/navigation";


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
        borderRadius: 4,
        boxShadow: 3,
        flex: 1,
        overflowWrap: "anywhere",
        overflow: "hidden",
        transition: "transform 0.25s, box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
          cursor: "pointer",
        },
      }}
      onClick={goToActiveGroup}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative", pt: "50%" }}>
        <CardMedia
          component="img"
          image={activeGroup.images[currentImage]}
          alt={activeGroup.title}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Floating Like button */}
        <GenericEntityLikeButton
          entity={activeGroup}
          type="active-group"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        />

        {/* Category Chip */}
        <Chip
          label={activeGroup.category}
          size="small"
          sx={{
            bottom: 8,
            left: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "grey.300",
            color: "grey",
            position: "absolute",
            px: 1,
          }}
        />

        {/* Dots */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(idx);
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor:
                    idx === currentImage
                      ? "primary.main"
                      : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  border: "1px solid white",
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Title */}
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {activeGroup.title}
        </Typography>

        {/* Price Section */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              ₪{activeGroup.basePrice}
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main">
              ₪{activeGroup.groupPrice}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            / לאדם
          </Typography>
        </Box>

        {/* Countdown */}
        <Countdown deadline={activeGroup.deadline} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", m: 0 }} />

        {/* Participants */}
        <Box>
          <ParticipantsProgress
            current={activeGroup.participants.length}
            min={activeGroup.minParticipants}
            max={activeGroup.maxParticipants}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActiveGroupCard;
