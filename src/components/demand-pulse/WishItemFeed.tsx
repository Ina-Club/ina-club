"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import WishItemCard, { WishItemData } from "./WishItemCard";
import HorizontalNavigationWrapper from "@/components/wrapper/horizontal-navigation-wrapper";
import useHorizontalNavigationWrapper from "@/hooks/useHorizontalNavigationWrapper";

const ITEMS_PER_PAGE = 6; // 2 rows × 3 columns

interface WishItemFeedProps {
  limit?: number;
  sinceDays?: number;
  orderBy?: "likes";
  /** "grid" = wrapping grid (default, /requests page); "horizontal" = paged 2×3 carousel (home page) */
  layout?: "grid" | "horizontal";
  selectedCategories?: string[];
}

export default function WishItemFeed({
  limit,
  sinceDays,
  orderBy,
  layout = "grid",
  selectedCategories = [],
}: WishItemFeedProps) {
  const [items, setItems] = useState<WishItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCategoryKey = selectedCategories.filter(Boolean).join("\n");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    handleStartScrollClick,
    handleEndScrollClick,
    displayScroll,
    wrapperRef,
    handleTabsScroll,
  } = useHorizontalNavigationWrapper();

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (limit) params.set("limit", String(limit));
      if (sinceDays) {
        const since = new Date();
        since.setDate(since.getDate() - sinceDays);
        params.set("since", since.toISOString());
      }
      if (orderBy) params.set("orderBy", orderBy);
      if (selectedCategoryKey) {
        selectedCategoryKey
          .split("\n")
          .forEach((cat) => params.append("category", cat));
      }

      const res = await fetch("/api/wish-items/?" + params.toString(), { cache: "no-store" });
      if (res.ok) {
        const data: WishItemData[] = await res.json();
        setItems(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [limit, sinceDays, orderBy, selectedCategoryKey]);

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  const handleLikeToggle = (id: string, liked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, likeCount: item.likeCount + (liked ? 1 : -1), isLikedByMe: liked }
          : item
      )
    );
  };

  // ── Empty state ───────────────────────────────────────────────────────────────

  const emptyState = (
    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
      <Typography variant="body2" sx={{ fontSize: "1.5rem", mb: 0.5 }}>🛍️</Typography>
      <Typography variant="body2">היו הראשונים לפרסם מה אתם מחפשים</Typography>
    </Box>
  );

  // ── Horizontal paged layout ───────────────────────────────────────────────────

  if (layout === "horizontal") {
    // Chunk items into pages of 6 (2 rows × 3 cols)
    const pages: WishItemData[][] = [];
    for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
      pages.push(items.slice(i, i + ITEMS_PER_PAGE));
    }

    if (loading) {
      if (!isDesktop) {
        // Mobile skeleton: horizontal row matching 260×145px card size
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              overflowX: "auto",
              padding: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ flex: "0 0 260px", minWidth: 260, height: 145 }}>
                <Skeleton variant="rounded" height="100%" sx={{ borderRadius: "16px" }} />
              </Box>
            ))}
          </Box>
        );
      }
      // Desktop skeleton: 3 cols × 2 rows
      return (
        <Grid container spacing={1.5}>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Grid size={{ md: 4 }} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: "16px" }} />
            </Grid>
          ))}
        </Grid>
      );
    }
    if (items.length === 0) return emptyState;

    // Mobile: single horizontally scrollable row of fixed-width cards
    if (!isDesktop) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            overflowX: "auto",
            padding: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {items.map((item) => (
            <Box key={item.id} sx={{ flex: "0 0 260px", minWidth: 260, height: 145 }}>
              <WishItemCard item={item} onLikeToggle={handleLikeToggle} />
            </Box>
          ))}
        </Box>
      );
    }

    // Desktop: paged carousel — each slide is full-width, 3 cols × 2 rows
    return (
      <HorizontalNavigationWrapper
        handleStartScrollClick={handleStartScrollClick}
        handleEndScrollClick={handleEndScrollClick}
        displayScroll={displayScroll}
      >
        <Box
          ref={wrapperRef}
          sx={{ display: "flex", overflow: "hidden", width: "100%" }}
          onScroll={handleTabsScroll}
        >
          {pages.map((pageItems, pageIndex) => (
            <Box key={pageIndex} sx={{ flex: "0 0 100%", minWidth: "100%" }}>
              <Grid container spacing={1.5}>
                {pageItems.map((item) => (
                  <Grid size={{ md: 4 }} key={item.id}>
                    <WishItemCard item={item} onLikeToggle={handleLikeToggle} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </HorizontalNavigationWrapper>
    );
  }

  // ── Grid layout (default, /requests page) ────────────────────────────────────

  const skeletonGrid = (
    <Grid container spacing={1.5}>
      {[1, 2, 3].map((i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Skeleton variant="rounded" height={110} sx={{ borderRadius: "16px" }} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      {loading ? skeletonGrid : items.length === 0 ? emptyState : (
        <Grid container spacing={1.5}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <WishItemCard item={item} onLikeToggle={handleLikeToggle} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
