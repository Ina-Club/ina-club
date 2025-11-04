"use client";

import { Container, Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import PriceAnalyzerComponent from "@/components/price-analyzer";

export default function PriceAnalyzerPage() {
  const headerText = "מנתח מחירים";
  const descriptionText = "מצא את המוצר המושלם עבורך באמצעות מנתח מחירים מבוסס AI וגלה כמה תוכל לחסוך בעזרת קבוצת רכישה.";

  return (
    <>
      <DefaultPageBanner header={headerText} description={descriptionText} />
      <Container
        sx={{
          px: { xs: "17px", md: "0px" },
          py: 4,
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            mt: { xs: -8, md: -7 },
            mb: { xs: 4, md: 4 },
          }}
        >
          <PriceAnalyzerComponent />
        </Box>
      </Container>
    </>
  );
}