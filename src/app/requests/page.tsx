import { Box, Container } from "@mui/material";
import { Metadata } from "next";
import WishItemFeed from "@/components/demand-pulse/WishItemFeed";
import { DefaultPageBanner } from "@/components/default-page-banner";

export const metadata: Metadata = {
  title: "בקשות | INA Club",
  description: "כאן תוכלו לראות מה הקהילה רוצה לרכוש ולסמן בלייק בקשות של אחרים.",
};

export default function RequestsPage() {
  const headerText = "כל הבקשות";
  const descriptionText = "גלה מה הקהילה מחפשת לקנות, סמן לייק לבקשות רלוונטיות ועזור לנו לפתוח קבוצות חדשות.";

  return (
    <>
      <DefaultPageBanner header={headerText} description={descriptionText} />

      <Box sx={{ py: { xs: 4, md: 6 }, minHeight: "100vh" }}>
        <Container maxWidth="lg">
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
    </>
  );
}