import { Box, Container, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import WishItemFeed from "@/components/demand-pulse/WishItemFeed";

export const metadata: Metadata = {
  title: "בקשות | INA Club",
  description: "כאן תוכלו לראות מה הקהילה רוצה לרכוש, להוסיף בקשות משלכם ולסמן בלייק בקשות של אחרים.",
};

// Load client component dynamically to keep section SSR-safe


export default function RequestsPage() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 }, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: "primary.main",
                letterSpacing: "-0.02em"
              }}
            >
              לוח בקשות
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", lineHeight: 1 }}>📡</Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.1rem" }
            }}
          >
            מה הקהילה רוצה לרכוש הפעם? כשמספיק אנשים מביעים עניין — אנחנו פותחים קבוצת רכישה.
            הוסיפו בקשה משלכם או סמנו בלייק בקשות שמעניינות אתכם.
          </Typography>
        </Box>

        {/* Feed Section */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "24px",
            p: { xs: 2, md: 4 },
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.05)"
          }}
        >
          <WishItemFeed />
        </Box>
      </Container>
    </Box>
  );
}