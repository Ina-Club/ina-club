'use client';
import { Suspense } from "react";
import { mockRequestGroups } from "lib/mock";
import { Box, Container, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PageBanner } from "@/components/page-banner";
import { RequestGroupFilters } from "@/components/request-group-filters"
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";
import { useState } from "react";
import RequestGroupCard from "@/components/card/request-group-card";

export default function Page() {
  const requestGroups = mockRequestGroups.concat(mockRequestGroups);
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <PageBanner />
      {/* 🔍 שדה חיפוש */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          mt: { xs: -6, md: -3 }, // 🟢 מרים את הפילטרים חצי על הגרדיאנט
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: "12px",
          py: { xs: 2, md: 1 },
          px: { xs: 5, md: 1 },
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <SearchIcon sx={{ color: "action.active", ml: 1 }} />
        <InputBase
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={searchText === "" ? "חפש בקשות..." : ""}
          inputProps={{ "aria-label": "search" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          py: { xs: 2, md: 3 },
          px: { xs: 0, md: 5 },
          gap: 5,
          alignItems: "flex-start"
        }}>
        <Box>
          <RequestGroupFilters />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",        // 1 column on mobile
              md: "repeat(3, 1fr)", // 3 columns on desktop
            },
            width: "100%",
            px: { xs: 2, md: 2 },
            position: "inherit",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, md: 2 },
          }}>
          <Suspense fallback={<RequestGroupSectionSkeleton />}>
            {requestGroups.map((requestGroup, requestGroupIndex) => (
              <RequestGroupCard key={requestGroupIndex} requestGroup={requestGroup} />
            ))}
          </Suspense>
        </Box>
      </Box>
    </>
  );
}
