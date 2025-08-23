
import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { ShoppingBag, People } from "@mui/icons-material";

interface HeroProps {
  onOpenQuickRequest?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuickRequest }) => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: "#1a2a5a",
        color: "white",
        overflow: "hidden",
        background:
          "linear-gradient(140deg,rgba(255, 255, 255, 1) 0%, rgba(211, 224, 235, 1) 100%)",
        py: { xs: 10, md: 14 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Background Circles */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 40,
            width: 288,
            height: 288,
            bgcolor: "#f0a868",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            right: 40,
            width: 384,
            height: 384,
            bgcolor: "#1a2a5a",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          maxWidth: 1280,
          mx: "auto",
        }}
      >
        {/* Heading */}
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { md: "3.75rem", xs: "2.4rem" },
            lineHeight: 1.2,
            mb: 2,
            color: "#1a2a5a",
          }}
        >
          ביחד זה משתלם
          <Box
            component="span"
            sx={{
              display: "block",
              fontSize: { md: "3.75rem", xs: "2.4rem" },
              color: "#f0a868",
            }}
          >
            יותר
          </Box>
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#1a2a5a",
            mb: 4,
            fontSize: { md: "1.5rem", xs: "1rem" },
          }}
        >
          הצטרפו למהפכת הקניות הקבוצתיות. קונים יחד, חוסכים יחד, ומקבלים את
          המחירים הטובים ביותר.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            onClick={onOpenQuickRequest}
            startIcon={<ShoppingBag />}
            sx={{
              bgcolor: "#f0a868",
              color: "#1a2a5a",
              px: 2,
              py: 2,
              width: { md: "15rem", xs: "80%" },
              gap: 2,
              borderRadius: 3,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#eeb17e" },
            }}
          >
            צור בקשת רכישה חדשה
          </Button>

          <Button
            variant="outlined"
            startIcon={<People />}
            sx={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "#1a2a5a",
              px: 2,
              py: 2,
              width: { md: "15rem", xs: "80%" },
              gap: 2,
              borderRadius: 3,
              border: "1px solid  #1a2a5a",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            עיין בקבוצות פעילות
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            gap: { md: 14, xs: 2 },
            mt: 4,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: "#f0a868",
                fontWeight: "bold",
                fontSize: { md: "3rem", xs: "2rem" },
              }}
            >
              +2,800
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#1a2a5a" }}>
              בקשות פעילות
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#1a2a5a",
                fontSize: { md: "3rem", xs: "2rem" },
              }}
            >
              +₪1.2M
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#1a2a5a" }}>
              נחסכו השבוע
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: "#f0a868",
                fontWeight: "bold",
                fontSize: { md: "3rem", xs: "2rem" },
              }}
            >
              +15,400
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#1a2a5a" }}>
              משתתפים פעילים
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
