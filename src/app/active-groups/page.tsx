"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import ActiveGroupCard from "@/components/card/active-group-card";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";
import { FilterState } from "@/components/group-filters/filters";
import { ActiveGroup } from "lib/dal";
import { SearchBar } from "@/components/search-bar";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import { DEFAULT_PAGINATION } from "../config/pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import ResponsiveVerticalCardWrapper from "@/components/wrapper/responsive-vertical-card-wrapper";
import { GroupStatus } from "lib/types/status";

export default function Page() {
  const headerText = "כל הקבוצות";
  const descriptionText =
    "גלה את כל הקבוצות הפעילות, הצטרף לרכישות קבוצתיות וחסוך כסף יחד עם אחרים.";
  const debounceDelay: number = 400; //Time in milliseconds
  const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const latestRequestIdRef = useRef(0);
  const [filterState, setFilterState] = useState<FilterState>({
    searchText: "",
    categories: [],
    locations: [],
    popularities: [],
    priceRange: [0, 10_000], //TODO: Change this to the price of highest active group
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const debouncedParams: FilterState = useDebouncedValue(filterState, debounceDelay);

  const buildParams = useCallback((nextCursor?: string | null) => {
    const params = new URLSearchParams({
      limit: DEFAULT_PAGINATION.toString(),
    });
    params.append("statuses", GroupStatus.OPEN);
    params.append("statuses", GroupStatus.ACTIVATED);
    const trimmedSearch = debouncedParams.searchText.trim();
    if (nextCursor) params.set("cursor", nextCursor);
    if (trimmedSearch) params.set("search", trimmedSearch);
    debouncedParams.categories.forEach((category) => params.append("category", category));
    if (debouncedParams.priceRange) {
      const [minPrice, maxPrice] = debouncedParams.priceRange;
      if (minPrice > 0) params.set("minPrice", minPrice.toString());
      if (maxPrice < 10_000) params.set("maxPrice", maxPrice.toString());
    }
    return params.toString();
  }, [debouncedParams]);

  const handleSearchTextChange = (newText: string) => {
    setFilterState((prev) => ({ ...prev, searchText: newText }));
  };

  const fetchPage = useCallback(async (opts?: { cursor?: string | null; append?: boolean; signal?: AbortSignal }) => {
    const append = opts?.append ?? false;
    const nextCursor = opts?.cursor ?? null;

    // מזהה של הבקשה הנוכחית
    const requestId = ++latestRequestIdRef.current;

    if (append) {
      if (!nextCursor || loadingMoreRef.current || loadingRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
    } else {
      loadingRef.current = true;
      setLoading(true);
    }

    const urlParams: string = buildParams(nextCursor);

    try {
      const res = await fetch("/api/active-groups/?" + urlParams, {
        signal: opts?.signal,
      });

      const data = await res.json();
      const incoming: ActiveGroup[] = data.activeGroups ?? [];

      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.nextCursor);

      setActiveGroups((prev) => {
        if (!append) return incoming;

        const seen = new Set(prev.map((r) => r.id));
        const filtered = incoming.filter((r) => !seen.has(r.id));

        return [...prev, ...filtered];
      });
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      if (!append) setActiveGroups([]);
    } finally {
      // כיבוי loading רק אם זו עדיין הבקשה האחרונה
      if (requestId === latestRequestIdRef.current) {
        if (append) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        } else {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    }
  }, [buildParams]);


  useEffect(() => {
    setCursor(null);
    setHasMore(true);
    const controller = new AbortController();
    fetchPage({ append: false, cursor: null, signal: controller.signal });
    return () => controller.abort();
  }, [debouncedParams, fetchPage]);

  const handleLoadMore = useCallback(() => {
    if (!cursor || !hasMore) return;
    fetchPage({ cursor, append: true });
  }, [cursor, fetchPage, hasMore]);

  return (
    <>
      <DefaultPageBanner
        mainSx={{ top: -66, zIndex: 900, position: "sticky" }}
        header={headerText} description={descriptionText} />

      {/* Top bar: Search + Mobile filters trigger */}
      <Box
        sx={{
          maxWidth: 800,
          mx: { xs: 2, md: "auto" },
          // position: "relative",
          mt: { xs: -4, md: -3 },
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: "12px",
          p: 1,
          display: "flex",
          position: "sticky",
          top: 82,
          zIndex: 1000,
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
            top: 176,
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
        <ResponsiveVerticalCardWrapper
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        >
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
        </ResponsiveVerticalCardWrapper>
      </Box>
    </>
  );
}
