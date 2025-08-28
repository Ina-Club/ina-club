"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ActiveGroup } from "lib/dal";
import { useState } from "react";
import ParticipantsProgress from "./participations-progress-bar";
import Countdown from "./countdown";

interface ActiveGroupCardProps {
  activeGroup: ActiveGroup;
}

const ActiveGroupCard: React.FC<ActiveGroupCardProps> = ({ activeGroup }) => {
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        width: "100%",
        overflow: "hidden",
        transition: "transform 0.25s, box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={activeGroup.images[currentImage]}
          alt={activeGroup.title}
          sx={{
            height: 150,
            width: "100%",
            objectFit: "cover",
          }}
        />

        {/* Floating Like button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "grey.600" }} />
          )}
        </IconButton>

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
                onClick={() => setCurrentImage(idx)}
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
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            ₪{activeGroup.price.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / לאדם
          </Typography>
        </Box>

        {/* Countdown */}
        <Countdown deadline={activeGroup.deadline} />

        {/* Participants */}
        <Box sx={{ mb: 2 }}>
          <ParticipantsProgress
            current={activeGroup.participants.length}
            max={activeGroup.numberOfParticipants}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActiveGroupCard;
