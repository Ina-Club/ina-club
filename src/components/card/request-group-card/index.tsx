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
  IconButton,
  Alert,
  AlertTitle,
  Tooltip,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useState } from "react";

interface RequestGroupCardProps {
  requestGroup: RequestGroup;
}

const RequestGroupCard: React.FC<RequestGroupCardProps> = ({ requestGroup }) => {
  const router = useRouter();
  const goToRequestGroup = () => router.push(`/request-groups/${requestGroup.id}`);
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const isOpen: boolean = requestGroup.status === GroupStatus.OPEN;
  const isPreview: boolean = requestGroup.status === GroupStatus.PREVIEW;
  const isClosed: boolean = requestGroup.status === GroupStatus.CLOSED;
  const isCanceled: boolean = requestGroup.status === GroupStatus.CANCELED;
  const isExpired: boolean = requestGroup.status === GroupStatus.EXPIRED;
  const isPending: boolean = requestGroup.status === GroupStatus.PENDING;

  const getStatusDescription = (status: GroupStatus) => {
    switch (status) {
      case 'CLOSED': return "בוצעה עסקה דרך קבוצת רכישה.";
      case 'CANCELED': return "הבקשה לא עמדה בתנאי השימוש של האפליקציה ולכן לא אושרה.";
      case 'EXPIRED': return "תוקף הבקשה הסתיים.";
      case 'PENDING': return "הבקשה ממתינה לאישור."
      default: return ""; // For opened groups.
    }
  };

  const handleRequestGroupClick = () => {
    if (isOpen || isPreview) {
      goToRequestGroup();
    }
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: !isOpen && !isPreview ? 1 : 3,
        width: 350,
        height: 350,
        overflow: "hidden",
        transition: "transform 0.25s, box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        border: isPending ? 1 : 0,
        borderStyle: isPending ? "dashed" : "solid",
        borderColor: isPending ? "#ff9800" : "transparent",
        "&:hover": isOpen || isPreview
          ? {
            transform: "translateY(-6px)",
            boxShadow: 8,
          }
          : undefined,
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={requestGroup.images[currentImage]}
          alt={requestGroup.title}
          sx={{
            height: 150,
            width: "100%",
            objectFit: "cover",
            opacity: !isOpen && !isPreview ? 0.6 : 1,
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

        {/* Status Chip (only for canceled/expired/closed) */}
        {(!isOpen && !isPreview) && (
          <Tooltip
            title={getStatusDescription(requestGroup.status)}
            placement="top"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "#1a2a5a",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 4,
                  boxShadow: 3,
                },
              },
              arrow: {
                sx: { color: "#1a2a5a" },
              },
            }}
          >
            <Chip
              label={
                isCanceled ? "מבוטל" : isExpired ? "פג תוקף" : isPending ? "בתהליך" : "סגור"
              }
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: 600,
                color: (isExpired || isPending) ? "black" : "white",
                bgcolor: isClosed ? "primary.dark" : isExpired ? "#eeeeee" : isCanceled ? "#d32f2f" : isPending ? "#ff9800" : undefined,
                userSelect: "none",
              }}
            />
          </Tooltip>
        )}

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
          "&:hover": {
            cursor: isOpen ? "pointer" : "default",
          },
          pointerEvents: isOpen ? "auto" : "none",
          opacity: !isOpen && !isPreview ? 0.6 : 1,
        }}
        onClick={handleRequestGroupClick}
      >
        {/* Title */}
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {requestGroup.title}
        </Typography>

        {/* Meta Info */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          בקשה נוצרה לפני 2 ימים
        </Typography>

        {/* Participants */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
        {requestGroup.openedGroups.length ? (
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: "2px",
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
              py: "2px",
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
