import { Hero } from "@/components/hero";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeCriticalTools } from "@/components/home/HomeCriticalTools";
import ActiveGroupSectionWrapper from "@/components/wrapper/active-group-section-wrapper";
import CompanySectionWrapper from "@/components/wrapper/company-section-wrapper";

import DemandPulseSection from "@/components/demand-pulse/DemandPulseSection";
import { Box, Container } from "@mui/material";
import { Suspense } from "react";

const SECTION_TINT = "#e6edf6";

export default function Page() {
  return (
    <>
      <Hero />

      <HomeHowItWorks elevatedSurface />

      <Box
        sx={{
          bgcolor: SECTION_TINT,
          borderTop: "1px solid rgba(26, 42, 90, 0.06)",
        }}
      >
        <DemandPulseSection embeddedInTint />
      </Box>

      <Box
        sx={{
          bgcolor: "#ffffff",
          borderTop: "1px solid rgba(26, 42, 90, 0.06)",
        }}
      >
        <Container sx={{ px: { xs: "17px", md: "0px" } }}>
          <Suspense fallback={null}>
            <ActiveGroupSectionWrapper />
          </Suspense>
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: SECTION_TINT,
          borderTop: "1px solid rgba(26, 42, 90, 0.06)",
        }}
      >
        <Container sx={{ px: { xs: "17px", md: "0px" } }}>
          <Suspense fallback={null}>
            <CompanySectionWrapper />
          </Suspense>
        </Container>
      </Box>

      <HomeCriticalTools />
    </>
  );
}
