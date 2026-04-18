"use client";

import { useState } from "react";
import { Box, Container } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import WishItemComposer from "@/components/demand-pulse/WishItemComposer";
import WishItemFeed from "@/components/demand-pulse/WishItemFeed";

const HINT = [
  "בשורה הצפה מפרסמים בקשה חדשה (אחרי התחברות).",
  "בזרם למטה רואים בקשות אחרים — אפשר לסמן לייק לביקוש חזק.",
  "בקשות פופולריות עוזרות לנו לפתוח קבוצות רכישה.",
];

export function RequestsPageView() {
  const [feedKey, setFeedKey] = useState(0);

  return (
    <>
      <DefaultPageBanner
        mainSx={{ top: -66, zIndex: 900, position: "sticky" }}
        header="כל הבקשות"
        description="גלה מה הקהילה מחפשת לקנות, סמן לייק לבקשות רלוונטיות ועזור לנו לפתוח קבוצות חדשות."
        hintBullets={HINT}
      />

      <Box
        sx={{
          maxWidth: 800,
          width: "100%",
          px: { xs: 2, md: "auto" },
          mt: { xs: -4, md: -3 },
          mb: 2,
          boxShaow: 3,
          borderRadius: "14px",
          //p: 1.5,
          display: "flex",
          position: "sticky",
          top: 82,
          zIndex: 1000,
          alignItems: "center",
         // border: "2px solid transparent",
          //"&:hover": { borderColor: "#1a2a5a" },
        }}
      >
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <WishItemComposer onPosted={() => setFeedKey((k) => k + 1)} />
        </Box>
      </Box>

      <Box sx={{ py: { xs: 2, md: 4 }, minHeight: "50vh" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: "24px",
              p: { xs: 2, md: 4 },
              boxShadow: "0 8px 32px rgba(26, 42, 90, 0.08)",
              border: "1px solid rgba(26, 42, 90, 0.08)",
            }}
          >
            <WishItemFeed key={feedKey} showComposer={false} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
