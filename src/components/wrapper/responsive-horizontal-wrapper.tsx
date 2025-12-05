"use client";

import useHorizontalNavigationWrapper from "@/hooks/use-horizontal-navigation-wrapper";
import {
  Box,
  CircularProgress,
  ownerWindow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { cloneElement, useCallback, useEffect, useState } from "react";
import HorizontalNavigationWrapper from "./horizontal-navigation-wrapper";

const ResponsiveHorizontalListWrapper: React.FC<{
  children: React.ReactNode;
  gap?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}> = ({ children, gap, onLoadMore, hasMore = false, loadingMore = false }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const {
    handleStartScrollClick,
    handleEndScrollClick,
    displayScroll,
    wrapperRef,
    handleTabsScroll,
  } = useHorizontalNavigationWrapper();

  const [itemWidth, setItemWidth] = useState<number>();

  const maybeLoadMore = useCallback(() => {
    if (!onLoadMore || !hasMore || loadingMore) return;
    const el = wrapperRef.current;
    if (!el) return;
    const fetchThreshold: number = 40; // When 40px from the end of the list, attempt to fetch more
    const distanceToEnd: number = el.scrollWidth - (el.clientWidth - el.scrollLeft);
    if (distanceToEnd <= fetchThreshold) {
      onLoadMore();
    }
  }, [hasMore, loadingMore, onLoadMore, wrapperRef]);

  const triggerLoadMore = useCallback(() => {
    if (!onLoadMore || !hasMore || loadingMore) return;
    onLoadMore();
  }, [hasMore, loadingMore, onLoadMore]);

  const onScrollDesktop = useCallback(() => {
    handleTabsScroll();
    maybeLoadMore();
  }, [handleTabsScroll, maybeLoadMore]);

  const onEndClick = useCallback(() => {
    handleEndScrollClick();
    setTimeout(() => {
      maybeLoadMore();
      triggerLoadMore();
    }, 0);
  }, [handleEndScrollClick, maybeLoadMore, triggerLoadMore]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const resize = () => {
      setItemWidth(wrapperRef.current!.offsetWidth / 3.7);
    };
    resize();
    const win = ownerWindow(wrapperRef.current);
    win.addEventListener("resize", resize);
    return () => win.removeEventListener("resize", resize);
  }, [wrapperRef]);

  // apply calculated width to children
  const styledChildren = Array.isArray(children)
    ? children.map((child, i) =>
      cloneElement(child as React.ReactElement, {
        key: i,
        style: {
          ...(child as any).props.style,
          flex: `0 0 ${itemWidth}px`
        },
      })
    )
    : children;

  return !isDesktop ? (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Box
        ref={wrapperRef}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          gap: gap || "10px",
          padding: 1,
          overflowX: "auto", // fixed horizontal scroll for mobile
        }}
        onScroll={maybeLoadMore}
      >
        {styledChildren}
      </Box>
      {loadingMore && hasMore && (
        <CircularProgress size={30} sx={{
          left: "-30px",
          zIndex: 2,
        }} />
      )}
    </Box>
  ) : (
    <HorizontalNavigationWrapper
      handleStartScrollClick={handleStartScrollClick}
      handleEndScrollClick={onEndClick}
      displayScroll={displayScroll}
      loadingMore={loadingMore}
      hasMore={hasMore}
    >
      <Box
        onScroll={onScrollDesktop}
        ref={wrapperRef}
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
          gap: gap || "10px",
          padding: 1,
          overflow: "hidden",
        }}
      >
        {styledChildren}
      </Box>
    </HorizontalNavigationWrapper>
  );
};

export default ResponsiveHorizontalListWrapper;
