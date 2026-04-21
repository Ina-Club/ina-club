"use client";

import { Box, CircularProgress } from "@mui/material";
import ScrollPaginationWrapper from "./scroll-pagination-wrapper";

interface ResponsiveVerticalCardWrapperProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

const ResponsiveVerticalCardWrapper: React.FC<ResponsiveVerticalCardWrapperProps> = ({
  children,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
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
        {loadingMore && hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    )}
  </ScrollPaginationWrapper>
);

export default ResponsiveVerticalCardWrapper;
