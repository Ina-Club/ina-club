"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import Link from "next/link";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
const STEPS = [
  {
    icon: EditNoteOutlinedIcon,
    title: "מפרסמים בקשה",
    body: "כותבים מה תרצו לקנות — בדף הבקשות או מהבית.",
    href: "/requests",
    linkLabel: "לדף הבקשות",
  },
  {
    icon: FavoriteBorderIcon,
    title: "הקהילה מגיבה",
    body: "לייקים ותגובות מראים לספקים איפה יש ביקוש אמיתי.",
    href: "/requests",
    linkLabel: "לגלול בבקשות",
  },
  {
    icon: Groups2OutlinedIcon,
    title: "נפתחת קבוצה",
    body: "כשיש מספיק משתתפים — נוצרת קבוצת רכישה עם מחיר מוסכם.",
    href: "/active-groups",
    linkLabel: "קבוצות פעילות",
  },
  {
    icon: SavingsOutlinedIcon,
    title: "כולם חוסכים",
    body: "משלמים יחד, מקבלים מוצר במחיר טוב יותר ובפרופיל רואים קופונים והשתתפויות.",
    href: "/profile",
    linkLabel: "הפרופיל שלי",
  },
] as const;

type HomeHowItWorksProps = {
  /** על רקע לבן — כרטיסים בולטים יותר */
  elevatedSurface?: boolean;
};

export function HomeHowItWorks({ elevatedSurface = true }: HomeHowItWorksProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
        borderTop: "1px solid rgba(26, 42, 90, 0.06)",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: "0.12em",
            display: "block",
            mb: 1,
            textAlign: "center",
          }}
        >
          המסלול בקצרה
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            textAlign: "center",
            mb: 1,
            fontSize: { xs: "1.5rem", md: "1.85rem" },
          }}
        >
          איך עובדים עם Ina Club?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", maxWidth: 560, mx: "auto", mb: 4, lineHeight: 1.7 }}
        >
          ארבעה שלבים פשוטים — מרעיון לבקשה ועד חיסכון בקבוצה. בכל שלב אפשר ללחוץ ולעבור
          לדף הרלוונטי.
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 1.5 }}
          alignItems="stretch"
          justifyContent="center"
        >
          {STEPS.map((step, stepIndex) => {
            const Icon = step.icon;
            return (
              <Box key={step.title} sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <Paper
                  elevation={0}
                  component={Link}
                  href={step.href}
                  sx={{
                    p: 2.5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: elevatedSurface
                      ? "rgba(26, 42, 90, 0.12)"
                      : "rgba(26, 42, 90, 0.1)",
                    bgcolor: elevatedSurface ? "#f5f8fd" : "background.paper",
                    boxShadow: elevatedSurface
                      ? "0 12px 40px rgba(26, 42, 90, 0.12)"
                      : "0 4px 20px rgba(26, 42, 90, 0.06)",
                    transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: elevatedSurface
                        ? "0 18px 48px rgba(26, 42, 90, 0.16)"
                        : "0 12px 32px rgba(26, 42, 90, 0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 140, 66, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon sx={{ color: "secondary.dark", fontSize: 26 }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        bgcolor: "rgba(26, 42, 90, 0.06)",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                      }}
                    >
                      {stepIndex + 1}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, color: "primary.main" }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, flex: 1, mb: 1.5 }}>
                    {step.body}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="secondary.dark">
                    {step.linkLabel} ←
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
