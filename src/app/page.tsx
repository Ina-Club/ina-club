import { Hero } from "@/components/hero";
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";
import ActiveGroupSectionWrapper from "@/components/wrapper/active-group-section-wrapper";
import RequestGroupSectionWrapper from "@/components/wrapper/request-group-section-wrapper";
import { Box, Container } from "@mui/material";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Hero />
      <Container
        sx={{
          px: { xs: "17px", md: "0px" },
        }}
      >
        <Suspense fallback={<RequestGroupSectionSkeleton />}>
          <RequestGroupSectionWrapper />
        </Suspense>
      </Container>
      <Box
        sx={{
          backgroundColor: {
            xs: "#f5f7fa",
            md: "#f5f7fa",
          },
        }}
      >
        <Container
          sx={{
            px: { xs: "17px", md: "0px" },
          }}
        >
          <Suspense fallback={<ActiveGroupSectionWrapper />}>
            <ActiveGroupSectionWrapper />
          </Suspense>
        </Container>
      </Box>
    </>
  );
}
