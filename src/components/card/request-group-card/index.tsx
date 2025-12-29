"use client";

import { useRouter } from "next/navigation";
import { RequestGroup } from "lib/dal";
import { GroupStatus } from "lib/types/status";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useState } from "react";
import GenericEntityLikeButton from "@/components/floating-like-button/generic-entity-like-button";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

interface RequestGroupCardProps {
  requestGroup: RequestGroup;
}

const RequestGroupCard: React.FC<RequestGroupCardProps> = ({ requestGroup }) => {
  const router = useRouter();
  const goToRequestGroup = () => router.push(`/request-groups/${requestGroup.id}`);
  const [currentImage, setCurrentImage] = useState(0);

  const isOpen = requestGroup.status === GroupStatus.OPEN;

  const handleRequestGroupClick = () => {
    if (!isOpen) return;
    goToRequestGroup();
  }

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
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative", pt: "50%" }}>
        <CardMedia
          component="img"
          image={requestGroup.images[currentImage]}
          alt={requestGroup.title}
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
          entity={requestGroup}
          type="request-group"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        />

        {/* Category Chip */}
        <Chip
          label={requestGroup.category}
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
        {requestGroup.images.length > 1 && (
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

            {requestGroup.images.map((_, idx) => (
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
        sx={{
          p: 2,
          cursor: "pointer",
        }}
        onClick={handleRequestGroupClick}
      >
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          noWrap
        >
          {requestGroup.title}
        </Typography>

        {/* Meta Info */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          בקשה נוצרה לפני 2 ימים
        </Typography>

        {/* Participants */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PeopleAltOutlinedIcon
            sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            color="primary.main"
            mr={0.5}
          >
            {requestGroup.participants.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            מעוניינים
          </Typography>
        </Box>

        {/* Groups Info */}
        {requestGroup.openedGroups?.length ? (
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: "3.3px", // This particular amount is to make the smart-search cards be the exact same size
              bgcolor: "#e3e7f5",
              color: "#1a2a5a",
              fontSize: "0.75rem",
              "& .MuiAlert-icon": {
                color: "#1a2a5a",
              },
            }}
          >
            <AlertTitle sx={{ fontSize: "0.85rem", mb: 0, color: "#1a2a5a" }}>
              נפתחו {requestGroup.openedGroups.length} קבוצות
            </AlertTitle>
            {requestGroup.participants.length} רוכשים • אחרונה לפי 3 ימים
          </Alert>
        ) : (
          <Alert
            iconMapping={{
              success: <AccessTimeOutlinedIcon fontSize="inherit" />,
            }}
            sx={{
              bgcolor: "#fff7ec",
              color: "#ff8c42",
              fontSize: "0.75rem",
              "& .MuiAlert-icon": {
                color: "#f0a868",
              },
              borderRadius: 2,
              px: 1.5,
              py: "3.3px",
            }}
          >
            <AlertTitle sx={{ fontSize: "0.85rem", mb: 0, color: "#ff8c42" }}>
              ממתין לקבוצה ראשונה
            </AlertTitle>
            עוד מעט מעוניינים ונפתח קבוצה
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestGroupCard;
