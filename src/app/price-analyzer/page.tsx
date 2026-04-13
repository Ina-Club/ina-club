"use client";

import { Container, Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import PriceAnalyzerComponent from "@/components/price-analyzer";

export default function PriceAnalyzerPage() {
  const headerText = "מנתח מחירים";
  const descriptionText = "מצא את המוצר המושלם עבורך באמצעות מנתח מחירים מבוסס AI וגלה כמה תוכל לחסוך בעזרת קבוצת רכישה.";

  return (
    <>
      <DefaultPageBanner
        header={headerText}
        description={descriptionText}
        hintBullets={[
          "מתארים מוצר או מדביקים קישור — המערכת מציעה הערכת מחיר והשוואה לרכישה קבוצתית.",
          "התוצאה אינפורמטיבית; לפני רכישה כדאי לוודא מול הספק או הקבוצה.",
        ]}
      />
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
            mt: { xs: -8, md: -8 },
            mb: { xs: 4, md: 4 },
          }}
        >
          <PriceAnalyzerComponent />
        </Box>
      </Container>
    </>
  );
}