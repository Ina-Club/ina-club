"use client";

import { useCallback, useEffect, useRef } from "react";

type Orientation = "horizontal" | "vertical";

interface ScrollPaginationWrapperProps {
  children: (args: {
    wrapperRef: React.RefObject<HTMLElement | null>;
    onScroll: () => void;
    triggerLoadMore: (opts?: { force?: boolean }) => void;
    sentinelRef: React.RefObject<HTMLDivElement | null>;
  }) => React.ReactNode;
  orientation: Orientation;
  onLoadMore: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  fetchThreshold?: number;
  scrollRef?: React.RefObject<HTMLElement | null>;
}

const ScrollPaginationWrapper: React.FC<ScrollPaginationWrapperProps> = ({
  children,
  orientation,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  fetchThreshold,
  scrollRef,
}) => {
  const internalWrapperRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = scrollRef ?? internalWrapperRef;
  const distanceThreshold: number = fetchThreshold ?? (orientation === "vertical" ? 200 : 40);

  const canLoadMore = useCallback(() =>
    !!onLoadMore && hasMore && !loadingMore,
    [hasMore, loadingMore, onLoadMore]
  );

  const runLoadMore = useCallback(() => {
    if (!canLoadMore()) return;
    onLoadMore();
  }, [canLoadMore, onLoadMore]);

  const maybeLoadMore = useCallback(() => {
    if (!canLoadMore()) return;
    if (orientation === "horizontal") {
      const el = wrapperRef.current;
      if (!el) return;
      const distanceToEnd = el.scrollWidth - (el.clientWidth - el.scrollLeft);
      if (distanceToEnd <= distanceThreshold) runLoadMore();
    }
  }, [canLoadMore, distanceThreshold, orientation, runLoadMore, wrapperRef]);

  const handleScroll = useCallback(() => {
    maybeLoadMore();
  }, [maybeLoadMore]);

  const triggerLoadMore = useCallback(
    (opts?: { force?: boolean }) => {
      if (opts?.force) {
        runLoadMore();
        return;
      }
      maybeLoadMore();
    },
    [maybeLoadMore, runLoadMore]
  );

  useEffect(() => {
    if (orientation !== "vertical") return;
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runLoadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px 0px 0px 0px",
        threshold: 0,
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [orientation, runLoadMore]);

  useEffect(() => {
    if (orientation === "horizontal") {
      maybeLoadMore();
    }
  }, [maybeLoadMore, orientation]);

  return (
    <>
      {children({
        wrapperRef,
        onScroll: handleScroll,
        triggerLoadMore,
        sentinelRef,
      })}
    </>
  );
};

export default ScrollPaginationWrapper;
