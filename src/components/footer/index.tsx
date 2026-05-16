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
  Instagram as InstagramIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const INA_CLUB_INSTAGRAM_URL = "https://www.instagram.com/inaclub.official/"

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, #243a7a 100%)`,
        color: "white",
        py: { xs: 3, md: 6 },
        mt: "auto",
        borderTop: "1px solid rgba(255,255,255,0.12)",
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
              הפלטפורמה היחידה בישראל לרכישות קבוצתיות חכמות.
              חסוך כסף על המוצרים שאתה אוהב עם אלפי קונים נוספים.
            </Typography>

            {/* רשתות חברתיות */}
            <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
              עקבו אחרינו והצטרפו לקהילה:
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
                aria-label="אינסטגרם"
                href={INA_CLUB_INSTAGRAM_URL}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>

          {/* קישורים מהירים */}
          <Box sx={{ flex: { xs: "none", md: 1 }, ml: { xs: "none", md: 5 } }}>
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
              <Link href="/requests" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                📋 בקשות ויצירת בקשה
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
                  <Link
                    href="mailto:support@inaclub.co.il"
                    underline="hover"
                    color="inherit"
                  >
                    support@inaclub.co.il
                  </Link>
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
            <Link href="/about" underline="hover" color="inherit" variant="body2">
              מי אנחנו
            </Link>

            <Link href="/privacy-policy" underline="hover" color="inherit" variant="body2">
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
