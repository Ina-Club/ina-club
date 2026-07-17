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

// Height of sticky AppBar (Toolbar default = 64px)
const APPBAR_H = 100;

export default function Page() {
  const headerText = "כל הקבוצות";
  const descriptionText =
    "גלה את כל הקבוצות הפעילות, הצטרף לרכישות קבוצתיות וחסוך כסף יחד עם אחרים.";
  const debounceDelay: number = 400;
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
    companies: [],
    statuses: [],
    participantRange: "",
    priceRange: [0, 10_000],
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const debouncedParams: FilterState = useDebouncedValue(filterState, debounceDelay);

  const buildParams = useCallback((nextCursor?: string | null) => {
    const params = new URLSearchParams({
      limit: DEFAULT_PAGINATION.toString(),
    });

    if (debouncedParams.statuses && debouncedParams.statuses.length > 0) {
      debouncedParams.statuses.forEach((status) => params.append("status", status));
    } else {
      params.append("status", GroupStatus.OPEN);
      params.append("status", GroupStatus.ACTIVATED);
    }

    if (debouncedParams.participantRange) {
      params.set("participantRange", debouncedParams.participantRange);
    }

    const trimmedSearch = debouncedParams.searchText.trim();
    if (nextCursor) params.set("cursor", nextCursor);
    if (trimmedSearch) params.set("search", trimmedSearch);
    debouncedParams.categories.forEach((category) => params.append("category", category));
    if (debouncedParams.companies) {
      debouncedParams.companies.forEach((company) => params.append("company", company));
    }
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

  // ── Filter panel: prevent wheel scroll from propagating to the page ─────────
  // The filter panel has its own overflowY:auto scroll. By stopping propagation
  // when the pointer is over it, scrolling the filter never moves the page body.
  const filterColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = filterColRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
      // Only prevent if there is still content to scroll inside the panel
      if (!atTop && !atBottom) {
        e.stopPropagation();
      }
    };
    el.addEventListener("wheel", handler, { passive: true });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    // The page itself scrolls normally — no height/overflow constraints here
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* ─── Banner ─────────────────────────────────────────── */}
      <DefaultPageBanner
        mainSx={{ top: -66, zIndex: 900, position: "sticky" }}
        header={headerText}
        description={descriptionText}
        hintBullets={[
          "משתמשים בשורת החיפוש ובסינון (במובייל דרך הסינון) כדי לצמצם תוצאות.",
          "לוחצים על כרטיס כדי לראות פרטים מלאים ולהצטרף לקבוצה.",
          "התקדמות רישום ומחירים מופיעים בכרטיס ובדף הקבוצה.",
        ]}
      />

      {/* ─── Sticky search bar ──────────────────────────────── */}
      <Box
        sx={{
          mx: { xs: 2, md: "auto" },
          maxWidth: { xs: "calc(100% - 32px)", md: 800 },
          width: { md: 800 },
          mt: { xs: -4, md: -3 },
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: "12px",
          p: 1,
          display: "flex",
          position: "sticky",
          top: APPBAR_H,
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
        {/* Mobile filter trigger (bottom-sheet drawer) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <GroupFilters
            mode="trigger"
            group="active"
            filterState={filterState}
            onFilterChange={setFilterState}
          />
        </Box>
      </Box>

      {/* ─── Two-column layout ──────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          mt: 2,
          px: { xs: 0, md: 3 },
          gap: { md: 3 },
          alignItems: "flex-start",
          pb: 4,
        }}
      >
        {/* ── Filter panel (desktop sidebar) ─────────────────── */}
        {/*
          position:sticky so it stays visible while the cards column scrolls the page.
          top = appbar + searchbar + a small gap.
          max-height + overflowY:auto give it its own internal scroll.
          The wheel handler above prevents the internal scroll from
          propagating to the page body.
        */}
        <Box
          ref={filterColRef}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            width: 270,
            flexShrink: 0,
            position: "sticky",
            mt: 2,
            direction: "rtl",
            top: APPBAR_H + 68, // appbar + searchbar height + gap
            maxHeight: `calc(100vh - ${APPBAR_H + 68 + 24}px)`,
            overflowY: "auto",
            overscrollBehavior: "contain",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 4 },
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              border: "1px solid",
              borderColor: "grey.200",
               direction: "ltr",
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "grey.100",
                bgcolor: "#f8f9fc",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#1a2a5a",
                  letterSpacing: 0.2,
                }}
              >
                סינון
              </Box>
            </Box>
            <GroupFilters
              mode="sidebar"
              group="active"
              filterState={filterState}
              onFilterChange={setFilterState}
            />
          </Box>
        </Box>

        {/* ── Cards column ─────────────────────────────────────── */}
        {/* Normal flow — the page body scrolls this naturally */}
        <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%" } }}>
          <ResponsiveVerticalCardWrapper
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
            loadingSkeleton={
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  px: { xs: 2, md: 1 },
                  gap: { xs: 3, md: 2 },
                  mt: 2,
                }}
              >
                {Array.from({ length: DEFAULT_PAGINATION }).map((_, i) => (
                  <ActiveGroupCardSkeleton key={i} />
                ))}
              </Box>
            }
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                px: { xs: 2, md: 1 },
                gap: { xs: 3, md: 2 },
              }}
            >
              <Suspense fallback={<GroupSectionSkeleton />}>
                {loading ? (
                  Array.from({ length: DEFAULT_PAGINATION }).map((_, i) => (
                    <ActiveGroupCardSkeleton key={i} />
                  ))
                ) : activeGroups.length > 0 ? (
                  activeGroups.map((activeGroup, index) => (
                    <ActiveGroupCard key={index} activeGroup={activeGroup} />
                  ))
                ) : (
                  <Box
                    sx={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      justifyContent: "center",
                      mt: { xs: 4, md: 6 },
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
      </Box>
    </Box>
  );
}
