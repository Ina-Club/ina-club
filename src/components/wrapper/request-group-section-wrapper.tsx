"use client";

import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import { Box } from "@mui/material";
import RequestGroupCard from "../card/request-group-card";
import SectionWrapper from "./section-wrapper";
import { RequestGroup } from "lib/dal";
import { useState, useEffect } from "react";
import RequestGroupCardSkeleton from "../skeleton/request-group-card-skeleton";
import { DEFAULT_PAGINATION } from "@/app/config/pagination";

interface RequestGroupSectionWrapperProps {}

const RequestGroupSectionWrapper: React.FC<
  RequestGroupSectionWrapperProps
> = () => {
  const [allOpenRequestGroupsWithParent, setAllOpenRequestGroupsWithParent] =
    useState<RequestGroup[]>([]);
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
      limit: DEFAULT_PAGINATION.toString(),
    });
    if (nextCursor) params.set("cursor", nextCursor);

    try {
      const res = await fetch("/api/request-groups/?" + params.toString());
      const data = await res.json();
      const incoming: RequestGroup[] = data.requestGroups ?? [];
      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.nextCursor);
      setAllOpenRequestGroupsWithParent((prev) => {
        if (!append) return incoming;
        const seen = new Set(prev.map((r) => r.id));
        const filtered = incoming.filter((r) => !seen.has(r.id));
        return [...prev, ...filtered];
      });
    } catch {
      if (!append) setAllOpenRequestGroupsWithParent([]);
    } finally {
      if (append) setLoadingMore(false);
      else setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <SectionWrapper
      title="הבקשות הפופולריות"
      subTitle="הבקשות החמות של השבוע האחרון"
      linkLabel="צפה בכל הבקשות"
      linkUrl="/request-groups"
    >
      <ResponsiveHorizontalListWrapper
        gap="16px"
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={() => fetchPage({ cursor, append: true })}
      >
        {initialLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                minWidth: 250,
                minHeight: 250
              }}
            >
              <RequestGroupCardSkeleton key={i} />
            </Box>
          ))
        ) : allOpenRequestGroupsWithParent.length > 0 ? (
          allOpenRequestGroupsWithParent.map((requestGroup, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                minWidth: 250,
                minHeight: 250
              }}
            >
              <RequestGroupCard requestGroup={requestGroup} />
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
            לא נמצאו בקשות מהשבוע האחרון
          </Box>
        )}
      </ResponsiveHorizontalListWrapper>
    </SectionWrapper>
  );
};

export default RequestGroupSectionWrapper;
