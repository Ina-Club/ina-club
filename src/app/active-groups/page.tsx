"use client";

import { Suspense, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import ActiveGroupCard from "@/components/card/active-group-card";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";
import { FilterState } from "@/components/group-filters/filters";
import { ActiveGroup } from "lib/dal";
import { SearchBar } from "@/components/search-bar";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import { MAX_PAGINATION_LIMIT } from "../config/pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function Page() {
  const headerText = "כל הקבוצות";
  const descriptionText =
    "גלה את כל הקבוצות הפעילות, הצטרף לרכישות קבוצתיות וחסוך כסף יחד עם אחרים.";
  const debounceDelay: number = 400; //Time in milliseconds
  const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>({
    searchText: "",
    categories: [],
    locations: [],
    popularities: [],
    priceRange: [0, 10_000], //TODO: Change this to the price of highest active group
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const debouncedParams: FilterState = useDebouncedValue(filterState, debounceDelay);

  const buildParams = () => {
    const params = new URLSearchParams({
      status: "open",
      limit: MAX_PAGINATION_LIMIT.toString(),
    });
    const trimmedSearch = filterState.searchText.trim();
    if (cursor) params.set("cursor", cursor);
    if (trimmedSearch) params.set("search", trimmedSearch);
    debouncedParams.categories.forEach((category) => params.append("category", category));
    if (debouncedParams.priceRange) {
      const [minPrice, maxPrice] = debouncedParams.priceRange;
      if (minPrice > 0) params.set("minPrice", minPrice.toString());
      if (maxPrice < 10_000) params.set("maxPrice", maxPrice.toString());
    }
    return params.toString();
  };

  const handleSearchTextChange = (newText: string) => {
    setFilterState((prev) => ({ ...prev, searchText: newText }));
  };

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const urlParams: string = buildParams();

    fetch("/api/active-groups/?" + urlParams, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setActiveGroups(data.activeGroups ?? []);
        setCursor(data.nextCursor ?? null);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setActiveGroups([]);
      })
      .finally(() => { setLoading(false); });
    return () => controller.abort();
  }, [debouncedParams]);

  return (
    <>
      <DefaultPageBanner header={headerText} description={descriptionText} />

      {/* Top bar: Search + Mobile filters trigger */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          mt: { xs: -6, md: -3 },
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: "12px",
          py: { xs: 2, md: 1 },
          px: { xs: 2, md: 2 },
          display: "flex",
          alignItems: "center",
          border: "2px solid transparent",
          "&:hover": { borderColor: "#1a2a5a" },
        }}
      >
        <SearchBar
          searchText={filterState.searchText}
          placeholderText="חיפוש קבוצות..."
          handleSearchTextChange={handleSearchTextChange}
        />
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <GroupFilters
            mode="trigger"
            group="active"
            filterState={filterState}
            onFilterChange={setFilterState}
          />
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
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: "20px",
            alignSelf: "flex-start",
            zIndex: 1,
          }}
        >
          <GroupFilters
            mode="sidebar"
            group="active"
            filterState={filterState}
            onFilterChange={setFilterState}
          />
        </Box>

        {/* Cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            flex: 1,
            px: { xs: 2, md: 2 },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, md: 2 },
          }}
        >
          <Suspense fallback={<GroupSectionSkeleton />}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ActiveGroupCardSkeleton key={i} />
              ))
            ) : activeGroups.length > 0 ? (
              activeGroups.map((activeGroup, index) => (
                <ActiveGroupCard key={index} activeGroup={activeGroup} />
              ))
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  width: "100%",
                  transform: "translateX(-50%)",
                  mt: { xs: 4, md: 2 },
                  display: "flex",
                  justifyContent: "center",
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                לא נמצאו קבוצות התואמות לחיפוש שלך
              </Box>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  );
}
