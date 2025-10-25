"use client";

import { Container, Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import SmartSearchComponent from "@/components/smart-search";

export default function SmartSearchPage() {
  const headerText = "חיפוש חכם";
  const descriptionText = "מצא את המוצר המושלם עבורך וגלה כמה תוכל לחסוך באמצעות קבוצת רכישה";

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
          <SmartSearchComponent />
        </Box>
      </Container>
    </>
  );
}