"use client";

import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: "white",
        py: { xs: 3, md: 6 },
        mt: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* מידע על החברה */}
          <Box sx={{ flex: { xs: "none", md: 1 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              InaClub
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
              הפלטפורמה המובילה בישראל לרכישות קבוצתיות חכמות.
              חסוך כסף על המוצרים שאתה אוהב עם אלפי קונים נוספים.
            </Typography>

            {/* רשתות חברתיות */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="פייסבוק"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="אינסטגרם"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="טוויטר"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="לינקדאין"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="יוטיוב"
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Box>

          {/* קישורים מהירים */}
          <Box sx={{ flex: { xs: "none", md: 1 }, ml: {xs: "none", md: 5} }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              קישורים מהירים
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                🏠 דף הבית
              </Link>
              <Link href="/smart-search" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                🔍 חיפוש חכם
              </Link>
              <Link href="/active-groups" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                👥 קבוצות פעילות
              </Link>
              <Link href="/request-groups" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                📋 קבוצות מבוקשות
              </Link>
              <Link href="/create" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                ➕ צור קבוצה חדשה
              </Link>
              <Link href="/profile" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                👤 הפרופיל שלי
              </Link>
            </Box>
          </Box>

          {/* מידע ליצירת קשר */}
          <Box sx={{ flex: { xs: "none", md: 1 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              צור קשר
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  info@inaclub.co.il
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  03-1234567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  תל אביב, ישראל
                </Typography>
              </Box>
            </Box>
          </Box>


          {/* לינקים משפטיים */}
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="/privacy" underline="hover" color="inherit" variant="body2">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" underline="hover" color="inherit" variant="body2">
              תנאי שימוש
            </Link>
            <Link href="/contact" underline="hover" color="inherit" variant="body2">
              צור קשר
            </Link>
          </Box>
        </Box>

        <Divider sx={{ my: 3, bgcolor: "rgba(255, 255, 255, 0.2)" }} />

        {/* זכויות יוצרים */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} כל הזכויות שמורות לחברת Ina Innovations Ltd.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: "block" }}>
            פלטפורמת רכישות קבוצתיות חכמות לכלל האוכלוסייה בישראל
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
