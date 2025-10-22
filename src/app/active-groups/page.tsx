'use client';
import { Suspense, useState, useEffect, useMemo } from "react";
import { mockActiveGroups } from "lib/mock";
import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import ActiveGroupCard from "@/components/card/active-group-card";
import { applyFilters } from "lib/filters";
import { FilterState } from "@/components/group-filters/filters";
import { ActiveGroup } from "lib/dal";
import { SearchBar } from "@/components/search-bar";

export default function Page() {
  const headerText: string = "קבוצות הרכישה הפעילות";
  const descriptionText: string = "בעמוד זה חברות מציגות את ההצעות והבקשות שלהן, כדי לאפשר ללקוחות להצטרף לרכישות קבוצתיות וליהנות ממחירים משתלמים.";
  const allActiveGroups: ActiveGroup[] = mockActiveGroups.concat(mockActiveGroups);
  const [searchText, setSearchText] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    locations: [],
    popularities: [],
    priceRange: [0, 10_000]
  });

  // Apply all filters (text + categories + price + future filters)
  const filteredActiveGroups = useMemo(() => {
    return applyFilters(allActiveGroups, searchText, filterState);
  }, [allActiveGroups, searchText, filterState]);

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
        {/* Search box */}
        <SearchBar searchText={searchText} placeholderText="חיפוש קבוצות רכישה..." handleSearchTextChange={setSearchText} />

        {/* Mobile filters trigger (inside the same row as search) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <GroupFilters mode="trigger" group="active" filterState={filterState} onFilterChange={setFilterState} />
        </Box>
      </Box>

      {/* Content area */}
      <Box
        sx={{
          maxWidth: { xs: "100%", md: "85%" },
          display: "flex",
          flexDirection: "row",
          py: { xs: 2, md: 3 },
          px: { xs: 0, md: 5 },
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        {/* Desktop sidebar filters */}
        <Box sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: "20px",
          alignSelf: "flex-start",
          zIndex: 1
        }}>
          <GroupFilters mode="sidebar" group="active" filterState={filterState} onFilterChange={setFilterState} />
        </Box>

        {/* Cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, // mobile - 1 column, desktop - 3 columns
            flex: 1,
            px: { xs: 2, md: 2 },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, md: 2 },
          }}
        >
          <Suspense fallback={<GroupSectionSkeleton />}>
            {filteredActiveGroups.length > 0 ? (
              filteredActiveGroups.map((activeGroup, index) => (
                <ActiveGroupCard key={index} activeGroup={activeGroup} />
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
                לא נמצאו קבוצות רכישה התואמות לחיפוש שלך
              </Box>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  );
}
