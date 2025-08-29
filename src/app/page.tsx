import CompanyCard from "@/components/card/compant-card";
import { Hero } from "@/components/hero";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import ActiveGroupSectionWrapper from "@/components/wrapper/active-group-section-wrapper";
import CompanySectionWrapper from "@/components/wrapper/company-section-erapper";
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
        <Suspense fallback={<GroupSectionSkeleton />}>
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
      <Container
        sx={{
          px: { xs: "17px", md: "0px" },
        }}
      >
        <Suspense fallback={<CompanySectionWrapper />}>
          <CompanySectionWrapper />
        </Suspense>
      </Container>
    </>
  );
}
