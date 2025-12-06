'use client';
import { Suspense, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import RequestGroupCard from "@/components/card/request-group-card";
import { FilterState } from "@/components/group-filters/filters";
import { RequestGroup } from "lib/dal";
import { SearchBar } from "@/components/search-bar";
import RequestGroupCardSkeleton from "@/components/skeleton/request-group-card-skeleton";
import { MAX_PAGINATION_LIMIT } from "../config/pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function Page() {
  const headerText: string = "כל הבקשות";
  const descriptionText: string = "גלה את כל הבקשות הפעילות, הצטרף לקבוצות קנייה וחסוך כסף יחד עם אחרים.";
  const debounceDelay: number = 500; //Time in milliseconds
  const [openRequestGroups, setOpenRequestGroups] = useState<RequestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    locations: [],
    popularities: []
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const debouncedParams: FilterState = useDebouncedValue(filterState, debounceDelay);

  const buildParams = () => {
    const params = new URLSearchParams({
      status: "open",
      limit: MAX_PAGINATION_LIMIT.toString(),
    });
    const trimmedSearch = searchText.trim();
    if (cursor) params.set("cursor", cursor);
    if (trimmedSearch) params.set("search", trimmedSearch);
    debouncedParams.categories.forEach((category) => params.append("category", category));
    return params.toString();
  }

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const urlParams: string = buildParams();
    
    fetch('/api/request-groups/?' + urlParams, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { setOpenRequestGroups(data.requestGroups ?? []) })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setOpenRequestGroups([]);
      })
      .finally(() => { setLoading(false) });
    return () => controller.abort();
  }, [debouncedParams]);

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
          <GroupFilters mode="sidebar" group="request" filterState={filterState} onFilterChange={setFilterState} />
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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <RequestGroupCardSkeleton key={i} />)
            ) : openRequestGroups.length > 0 ? (
              openRequestGroups.map((requestGroup, index) => (
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
