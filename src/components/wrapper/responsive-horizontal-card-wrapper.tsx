"use client";

import useHorizontalNavigationWrapper from "@/hooks/useHorizontalNavigationWrapper";
import {
  Box,
  CircularProgress,
  ownerWindow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { cloneElement, useEffect, useState } from "react";
import HorizontalNavigationWrapper from "./horizontal-navigation-wrapper";
import ScrollPaginationWrapper from "./scroll-pagination-wrapper";

type StylableProps = {
  style?: React.CSSProperties;
};

const ResponsiveHorizontalCardWrapper: React.FC<{
  children: React.ReactNode;
  gap?: string;
}> = ({ children, gap }) => {
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
      cloneElement(child as React.ReactElement<StylableProps>, {
        key: i,
        style: {
          ...(child as any).props.style,
          flex: `0 0 ${itemWidth}px`
        },
      })
    )
    : children;

  return (
    <ScrollPaginationWrapper
      orientation="horizontal"
      onLoadMore={() => {}}
      scrollRef={wrapperRef}
    >
      {({ onScroll }) => {
        const onScrollDesktop = () => {
          handleTabsScroll();
          onScroll();
        };
        const onEndClick = () => {
          handleEndScrollClick();
        };

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
              onScroll={onScroll}
            >
              {styledChildren}
            </Box>
          </Box>
        ) : (
          <HorizontalNavigationWrapper
            handleStartScrollClick={handleStartScrollClick}
            handleEndScrollClick={onEndClick}
            displayScroll={displayScroll}
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
      }}
    </ScrollPaginationWrapper>
  );
};

export default ResponsiveHorizontalCardWrapper;
