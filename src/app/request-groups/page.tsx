'use client';
import { Suspense, useState } from "react";
import { mockRequestGroups } from "lib/mock";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PageBanner } from "@/components/page-banner";
import { RequestGroupFilters } from "@/components/request-group-filters";
import RequestGroupSectionSkeleton from "@/components/skeleton/request-group-section-skeleton";
import RequestGroupCard from "@/components/card/request-group-card";

export default function Page() {
  const requestGroups = mockRequestGroups.concat(mockRequestGroups);
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <PageBanner />
      {/* Top bar: Search + (mobile) Filters trigger */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          mt: { xs: -6, md: -3 }, // מרים את הסרגל חיפוש שיהיה קצת מעל הגרדיאנט
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: "12px",
          py: { xs: 2, md: 1 },
          px: { xs: 2, md: 2 },
          display: "flex",
          alignItems: "center"
        }}
      >
        {/* Search box */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}>
          <SearchIcon sx={{ color: "action.active", ml: 1 }} />
          <InputBase
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={searchText === "" ? "חפש בקשות..." : ""}
            inputProps={{ "aria-label": "search" }}
            sx={{ width: "100%" }}
          />
        </Box>

        {/* Mobile filters trigger (inside the same row as search) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <RequestGroupFilters mode="trigger" />
        </Box>
      </Box>

      {/* Content area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          py: { xs: 2, md: 3 },
          px: { xs: 0, md: 5 },
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        {/* Desktop sidebar filters */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <RequestGroupFilters />
        </Box>

        {/* Cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, // mobile - 1 column, desktop - 3 columns
            width: "100%",
            px: { xs: 2, md: 2 },
            position: "inherit",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, md: 2 },
          }}
        >
          <Suspense fallback={<RequestGroupSectionSkeleton />}>
            {requestGroups.map((requestGroup, index) => (
              <RequestGroupCard key={index} requestGroup={requestGroup} />
            ))}
          </Suspense>
        </Box>
      </Box>
    </>
  );
}
