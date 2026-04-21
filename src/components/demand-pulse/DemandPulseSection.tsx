"use client";

import { Box, Container } from "@mui/material";
import dynamic from "next/dynamic";
import SectionWrapper from "../wrapper/section-wrapper";

// Load client component dynamically to keep section SSR-safe
const WishItemFeed = dynamic(() => import("./WishItemFeed"), { ssr: false });

type DemandPulseSectionProps = {
  /** כשהסקשן עטוף ברקע צבוע (דף הבית) — בלי שכבת לבן כפולה */
  embeddedInTint?: boolean;
};

export default function DemandPulseSection({ embeddedInTint = false }: DemandPulseSectionProps) {
  return (
    <Box
      sx={{
        borderTop: embeddedInTint ? "none" : "1px solid rgba(26, 42, 90, 0.08)",
        bgcolor: embeddedInTint ? "transparent" : "background.paper",
      }}
    >
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
