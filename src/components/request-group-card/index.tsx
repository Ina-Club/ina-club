"use client";

import { RequestGroup } from "lib/dal";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";

interface RequestGroupCardProps {
  requestGroup: RequestGroup;
}

const RequestGroupCard: React.FC<RequestGroupCardProps> = ({
  requestGroup,
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: 3,
        width: "360px",
        boxShadow: 4,
        overflow: "hidden",
        transition: "transform 0.3s, boxShadow 0.3s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      {/* Image & Category & Like */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          sx={{
            height: "150px",
            width: "100%",
          }}
          component="img"
          image={requestGroup.images[0]}
          alt={requestGroup.title}
        />

        {/* Like button (top-right) */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.7)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <FavoriteIcon sx={{ color: "red" }} fontSize="small" />
          ) : (
            <FavoriteBorderIcon sx={{ color: "grey.600" }} fontSize="small" />
          )}
        </IconButton>

        {/* Category Chip (bottom-right) */}
        <Chip
          label={requestGroup.category}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: "grey.300",
            color: "grey",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, color: "black" }}>
        {/* Title */}
        <Typography sx={{ fontWeight: "bold", mb: 0.5, fontSize: "16px" }}>
          {requestGroup.title}
        </Typography>

        {/* Participants */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "grey" }}>
            בקשה נוצרה לפני 2 ימים
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontSize: 12, mr: 0.3, color: "grey" }}>
              מצטרפים
            </Typography>
            <Typography sx={{ fontSize: 12, mr: 0.5, color: "#f0a868" }}>
              {requestGroup.participants.length}
            </Typography>
            <PeopleAltOutlinedIcon
              sx={{ fontSize: 16, mr: 0.5, color: "#f0a868" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            justifyContent: "space-between",
          }}
        >
          {/* Price */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography sx={{ fontSize: "12px", color: "grey" }}>
                מחיר יעד
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                ₪{requestGroup.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Alert - Groups Info */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            {requestGroup.openedGroups.length ? (
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  px: 2,
                  maxWidth: "250px",
                  alignItems: "center",
                }}
              >
                <AlertTitle sx={{ fontSize: 12, mb: 0, mr: 0.5 }}>
                  נפתחו 2 קבוצות
                </AlertTitle>
              </Alert>
            ) : (
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  px: 2,
                  maxWidth: "250px",
                  alignItems: "center",
                }}
              >
                <AlertTitle sx={{ fontSize: 12, mb: 0, mr: 0.5 }}>
                  ממתין לקבוצה ראשונה
                </AlertTitle>
              </Alert>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestGroupCard;
