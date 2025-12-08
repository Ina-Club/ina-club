"use client";

import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalCardWrapper from "./responsive-horizontal-card-wrapper";
import { Box } from "@mui/material";
import ActiveGroupCard from "../card/active-group-card";
import { useState, useEffect } from "react";
import { ActiveGroup } from "lib/dal";
import ActiveGroupCardSkeleton from "../skeleton/active-group-card-skeleton";
import { DEFAULT_PAGINATION } from "@/app/config/pagination";

interface GroupSectionWrapperProps { }

const ActiveGroupSectionWrapper: React.FC<GroupSectionWrapperProps> = ({ }) => {
  const [allOpenActiveGroupsWithParent, setAllOpenActiveGroupsWithParent] =
    useState<ActiveGroup[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = async (opts?: { cursor?: string | null; append?: boolean }) => {
    const append = opts?.append ?? false;
    const nextCursor = opts?.cursor ?? null;
    if (append) {
      if (!nextCursor || loadingMore || initialLoading) return;
      setLoadingMore(true);
    } else {
      setInitialLoading(true);
    }

    const params = new URLSearchParams({
      status: "open",
      lastWeek: "true",
      limit: DEFAULT_PAGINATION.toString()
    });
    if (nextCursor) params.set("cursor", nextCursor);

    try {
      const res = await fetch("/api/active-groups/?" + params.toString());
      const data = await res.json();
      const incoming: ActiveGroup[] = data.activeGroups ?? [];
      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.nextCursor);
      setAllOpenActiveGroupsWithParent((prev) => {
        if (!append) return incoming;
        const seen = new Set(prev.map((r) => r.id));
        const filtered = incoming.filter((r) => !seen.has(r.id));
        return [...prev, ...filtered];
      });
    } catch {
      if (!append) setAllOpenActiveGroupsWithParent([]);
    } finally {
      if (append) setLoadingMore(false);
      else setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <>
      <SectionWrapper
        title={`הקבוצות הפופולריות`}
        subTitle={`קבוצות הרכישה החמות של השבוע האחרון`}
        linkLabel={`צפה בכל הקבוצות`}
        linkUrl={`/active-groups`}
      >
        <ResponsiveHorizontalCardWrapper
          gap="16px"
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={() => fetchPage({ cursor, append: true })}
        >
          {initialLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  minWidth: 250,
                  minHeight: 250
                }}
              >
                <ActiveGroupCardSkeleton />
              </Box>
            ))
          ) : allOpenActiveGroupsWithParent.length > 0 ? (
            allOpenActiveGroupsWithParent.map((activeGroup, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  minWidth: 250,
                  minHeight: 250
                }}
              >
                <ActiveGroupCard activeGroup={activeGroup} />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                width: "100%",
                transform: "translateX(-50%)",
                display: "flex",
                justifyContent: "center",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              לא נמצאו קבוצות מהשבוע האחרון
            </Box>
          )}
        </ResponsiveHorizontalCardWrapper>
      </SectionWrapper >
    </>
  );
};

export default ActiveGroupSectionWrapper;
