"use client";

import { Box, Container, Typography } from "@mui/material";
import dynamic from "next/dynamic";

// Load client component dynamically to keep section SSR-safe
const WishItemFeed = dynamic(() => import("./WishItemFeed"), { ssr: false });

export default function DemandPulseSection() {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        bgcolor: "#f8f9ff",
        borderTop: "1px solid rgba(66,100,212,0.08)",
        borderBottom: "1px solid rgba(66,100,212,0.08)",
      }}
    >
      <Container sx={{ px: { xs: "17px", md: "0px" } }}>
        {/* Section header */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, color: "text.primary" }}
            >
              דופק הביקוש
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", lineHeight: 1 }}>📡</Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.82rem" }}
          >
            מה הקהילה רוצה לרכוש הפעם? כשמספיק אנשים מביעים עניין — פותחים קבוצה.
          </Typography>
        </Box>

        <WishItemFeed />
      </Container>
    </Box>
  );
}
