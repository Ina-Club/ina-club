"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";

const TOOLS = [
  {
    title: "חיפוש חכם",
    body: "תארו במשפט אחד מה אתם מחפשים — נחזיר קבוצות ובקשות רלוונטיות.",
    href: "/smart-search",
    icon: SearchIcon,
  },
  {
    title: "מנתח מחירים",
    body: "השוו מחיר ליחיד מול מה שאפשר לחסוך כשקונים בקבוצה.",
    href: "/price-analyzer",
    icon: TrendingUpIcon,
  },
  {
    title: "כל הקבוצות הפעילות",
    body: "סינון לפי קטגוריה ומחיר, הצטרפות ישירה מהרשימה.",
    href: "/active-groups",
    icon: GroupsIcon,
  },
] as const;

export function HomeCriticalTools() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
        borderTop: "1px solid rgba(26, 42, 90, 0.08)",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Typography
          variant="overline"
          sx={{
            color: "secondary.dark",
            fontWeight: 800,
            letterSpacing: "0.1em",
            display: "block",
            mb: 1,
          }}
        >
          צעד הבא
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            mb: 1,
            fontSize: { xs: "1.45rem", md: "1.75rem" },
          }}
        >
          כלים שכדאי להכיר לפני שקונים
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, maxWidth: 520, lineHeight: 1.7 }}>
          שלושה מקומות שבהם רוב המשתמשים ממשיכים אחרי שמבינים את המסלול — לחיצה אחת לכל אחד.
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Paper
                key={tool.href}
                component={Link}
                href={tool.href}
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 3,
                  border: "1px solid rgba(26, 42, 90, 0.1)",
                  bgcolor: "#f4f7fc",
                  boxShadow: "0 14px 36px rgba(26, 42, 90, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 20px 44px rgba(26, 42, 90, 0.14)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 140, 66, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <Icon sx={{ color: "secondary.dark", fontSize: 26 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={800} color="primary.main" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {tool.body}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
