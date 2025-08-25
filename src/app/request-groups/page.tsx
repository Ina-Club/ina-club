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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",        // 1 column on mobile
              md: "repeat(3, 1fr)", // 3 columns on desktop
            },
            mx: "auto",
            py: { xs: 3, md: 2 },
            px: { xs: 2, md: 2 },
            position: "inherit",
            justifyContent: "center",
            gap: { xs: 3, md: 2 },
          }}>
          <Suspense fallback={<RequestGroupSectionSkeleton />}>
            {requestGroups.map((requestGroup, requestGroupIndex) => (
              <RequestGroupCard key={requestGroupIndex} requestGroup={requestGroup} />
            ))}
          </Suspense>
        </Box>
      </Container>
    </>
  );
}
