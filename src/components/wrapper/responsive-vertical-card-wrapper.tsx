"use client";

import { Box } from "@mui/material";
import ScrollPaginationWrapper from "./scroll-pagination-wrapper";

interface ResponsiveVerticalCardWrapperProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadingSkeleton?: React.ReactNode;
}

const ResponsiveVerticalCardWrapper: React.FC<ResponsiveVerticalCardWrapperProps> = ({
  children,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  loadingSkeleton,
}) => (
  <ScrollPaginationWrapper
    orientation="vertical"
    onLoadMore={onLoadMore}
    hasMore={hasMore}
    loadingMore={loadingMore}
  >
    {({ wrapperRef, sentinelRef }) => (
      <Box
        ref={wrapperRef as React.RefObject<HTMLDivElement>}
        sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}
      >
        {children}
        <Box ref={sentinelRef as React.RefObject<HTMLDivElement>} sx={{ height: 1, width: "100%" }} />
        {loadingMore && hasMore && loadingSkeleton}
      </Box>
    )}
  </ScrollPaginationWrapper>
);

export default ResponsiveVerticalCardWrapper;
