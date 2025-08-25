import { Suspense } from "react";
import { mockRequestGroups } from "lib/mock";
import { Box, Container } from "@mui/material";
import { PageBanner } from "@/components/page-banner";
import RequestGroupCard from "@/components/request-group-card";
import { RequestGroupFilters } from "@/components/request-group-filters"
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";

export default function Page() {
  const requestGroups = mockRequestGroups.concat(mockRequestGroups);

  return (
    <>
      <PageBanner />
      <RequestGroupFilters />
      <Container
        sx={{
          px: { xs: "17px", md: "0px" },
        }}
      >
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
            <Suspense fallback={<RequestGroupSectionSkeleton />}>
              <RequestGroupCard requestGroup={requestGroups[Math.floor(Math.random() * requestGroups.length)]} />
              <RequestGroupCard requestGroup={requestGroups[Math.floor(Math.random() * requestGroups.length)]} />
              <RequestGroupCard requestGroup={requestGroups[Math.floor(Math.random() * requestGroups.length)]} />

            </Suspense>
          </Box>
        ))}
      </Container>
    </>
  );
}
