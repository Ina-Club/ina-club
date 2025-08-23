import { Hero } from "@/components/hero";
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";
import RequestGroupSectionWrapper from "@/components/wrapper/request-group-section-wrapper";
import { Container } from "@mui/material";
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
    </>
  );
}
