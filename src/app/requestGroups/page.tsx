import { PageBanner } from "@/components/page-banner";
import { RequestGroupFilters } from "@/components/request-group-filters"
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";
import RequestGroupSectionWrapper from "@/components/wrapper/request-group-section-wrapper";
import { Box, Container } from "@mui/material";
import { Suspense } from "react";
import TempCard from "@/components/temp-card"

export default function Page() {
  return (
    <>
      <PageBanner />
      <RequestGroupFilters />
      <Container
        sx={{
          px: { xs: "17px", md: "0px" },
        }}
      >
        {/* TODO: Add this replace mocks later with this */}
        {/* <Suspense fallback={<RequestGroupSectionSkeleton />}>
          <RequestGroupSectionWrapper />
        </Suspense> */}
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{
            display: "flex",
            maxWidth: 1280,
            mx: "auto",
            position: "inherit",
            py: { xs: 2, md: 2 },
            px: { xs: 2, md: 2 },
            gap: 2,
            justifyContent: "center"
          }}>
            <TempCard />
            <TempCard />
          </Box>
        ))}
      </Container>
    </>
  );
}
