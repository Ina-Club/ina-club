import { RequestGroup } from "lib/dal";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

interface RequestGroupCardProps {
  requestGroup: RequestGroup;
}

const RequestGroupCard: React.FC<RequestGroupCardProps> = ({
  requestGroup,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        width: "100%",
        transition: "transform 0.3s, boxShadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      {/* Image & Category */}
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PeopleAltOutlinedIcon
            sx={{ fontSize: 16, mr: 0.5, color: "#f0a868" }}
          />
          <Typography sx={{ fontSize: 12, mr: 0.5, color: "#f0a868" }}>
            {requestGroup.participants.length}
          </Typography>
          <Typography sx={{ fontSize: 12, mr: 0.3, color: "grey" }}>
            מצטרפים
          </Typography>
        </Box>

        {/* Price & Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "grey", ml: "10px" }}>
              מחיר יעד
            </Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              ₪{requestGroup.price.toLocaleString()}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#f0a868",
              color: "#1a2a5a",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            הצטרף
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestGroupCard;
