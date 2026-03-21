"use client";

import { Box, Container } from "@mui/material";
import dynamic from "next/dynamic";
import SectionWrapper from "../wrapper/section-wrapper";

// Load client component dynamically to keep section SSR-safe
const WishItemFeed = dynamic(() => import("./WishItemFeed"), { ssr: false });

export default function DemandPulseSection() {
  return (
    <Box sx={{ borderTop: "1px solid rgba(66,100,212,0.08)" }}>
      <Container sx={{ px: { xs: "17px", md: "0px" } }}>
        <SectionWrapper
          title="הבקשות הפופולריות"
          subTitle="מה הקהילה הכי רוצה לקנות עכשיו"
          linkLabel="צפה בכל הבקשות"
          linkUrl="/requests"
        >
          <WishItemFeed showComposer={false} />
        </SectionWrapper>
      </Container>
    </Box>
  );
}
