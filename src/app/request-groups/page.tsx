'use client';
import { Suspense, useState, useEffect, useMemo } from "react";
import { mockRequestGroups } from "lib/mock";
import { Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import RequestGroupCard from "@/components/card/request-group-card";
import { applyFilters } from "lib/filters";
import { FilterState } from "@/components/group-filters/filters";
import { RequestGroup } from "lib/dal";
import { SearchBar } from "@/components/search-bar";

export default function Page() {
  const headerText: string = "כל הבקשות";
  const descriptionText: string = "גלה את כל הבקשות הפעילות, הצטרף לקבוצות קנייה וחסוך כסף יחד עם אחרים.";
  const allRequestGroups: RequestGroup[] = mockRequestGroups.concat(mockRequestGroups);
  const [searchText, setSearchText] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    locations: [],
    popularities: []
  });

  // Apply all filters (text + categories + future filters)
  const filteredRequestGroups = useMemo(() => {
    return applyFilters(allRequestGroups, searchText, filterState);
  }, [allRequestGroups, searchText, filterState]);

  // TODO: when filters will be lifted up, use this snippet to display an alert when a client attempts to refresh the app ONLY when filters were selected.
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <>
      <DefaultPageBanner header={headerText} description={descriptionText} />
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
          alignItems: "center",
          border: "2px solid transparent",
          "&:hover": {
            borderColor: "#1a2a5a"
          }
        }}
      >
        <SearchBar searchText={searchText} placeholderText="חיפוש בקשות..." handleSearchTextChange={setSearchText} />

        {/* Mobile filters trigger (inside the same row as search) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <GroupFilters mode="trigger" group="request" filterState={filterState} onFilterChange={setFilterState} />
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
          <GroupFilters mode="sidebar" group="request" filterState={filterState} onFilterChange={setFilterState} />
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
          <Suspense fallback={<GroupSectionSkeleton />}>
            {filteredRequestGroups.length > 0 ? (
              filteredRequestGroups.map((requestGroup, index) => (
                <RequestGroupCard key={index} requestGroup={requestGroup} />
              ))
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  width: "100%",
                  transform: "translateX(-50%)",
                  mt: { xs: 4, md: 2 }, // space below search bar
                  display: "flex",
                  justifyContent: "center",
                  color: "text.secondary",
                  textAlign: "center"
                }}
              >
                לא נמצאו בקשות התואמות לחיפוש שלך
              </Box>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  );
}
