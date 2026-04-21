"use client";

import {
  Box,
  Card,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";

const EXAMPLES = [
  "מכונית עד 5000 ש״ח",
  "אוזניות ביטול רעשים",
  "מקרר אינוורטר משפחתי",
];

const STEPS = [
  { n: 1, title: "כתבו משפט חופשי", body: "תארו מה אתם מחפשים — מחיר, מותג או קטגוריה." },
  { n: 2, title: "לחצו חיפוש או Enter", body: "המערכת שולחת את הבקשה ל-AI ומסננת תוצאות." },
  { n: 3, title: "עוברים לכרטיס", body: "מתוצאות הרלוונטיות נכנסים לדף קבוצה או בקשה." },
];

export const SmartSearchHelper = () => {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 }, mb: 6 }}>
      <Card
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "rgba(26, 42, 90, 0.12)",
          borderRadius: 3,
          boxShadow: "0 8px 40px rgba(26, 42, 90, 0.07)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            background: "linear-gradient(120deg, rgba(26,42,90,0.06) 0%, rgba(255,140,66,0.08) 100%)",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <TipsAndUpdatesOutlinedIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            לפני החיפוש — שלושה שלבים
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {STEPS.map((s) => (
              <Paper
                key={s.n}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "rgba(26, 42, 90, 0.08)",
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                  }}
                >
                  {s.n}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {s.body}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            נסו ללחוץ על דוגמה או להעתיק לשדה החיפוש:
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 2 }}>
            {EXAMPLES.map((ex) => (
              <Chip
                key={ex}
                icon={<SearchIcon sx={{ fontSize: "18px !important" }} />}
                label={ex}
                variant="outlined"
                sx={{
                  borderColor: "rgba(26, 42, 90, 0.25)",
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            מוצגות עד ארבע קבוצות פעילות ועד ארבע בקשות — הרלוונטיות ביותר לטקסט שלכם.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};
