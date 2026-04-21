"use client";

import { Box } from "@mui/material";
import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalCardWrapper from "./responsive-horizontal-card-wrapper";
import CompanyCard from "../card/company-card";
import { Company } from "lib/dal";
import { useState, useEffect } from "react";
import CompanyCardSkeleton from "../skeleton/company-card-skeleton";
import { DEFAULT_PAGINATION } from "@/app/config/pagination";

interface CompanySectionWrapperProps { }

const CompanySectionWrapper: React.FC<CompanySectionWrapperProps> = ({ }) => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
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
      limit: DEFAULT_PAGINATION.toString(),
    });
    if (nextCursor) params.set("cursor", nextCursor);

    try {
      const res = await fetch("/api/companies/?" + params.toString());
      const data = await res.json();
      const incoming: Company[] = data.companies ?? [];
      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.nextCursor);
      setAllCompanies((prev) => {
        if (!append) return incoming;
        const seen = new Set(prev.map((c) => c.id));
        const filtered = incoming.filter((c) => !seen.has(c.id));
        return [...prev, ...filtered];
      });
    } catch {
      if (!append) setAllCompanies([]);
    } finally {
      if (append) setLoadingMore(false);
      else setInitialLoading(false);
    }
  }

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <SectionWrapper
      title={`חברות מובילות`}
      subTitle={`הסטארטאפים והמותגים ששווה להכיר`}
      linkLabel={`צפה בכל החברות`}
      linkUrl={`/companies`}
    >
      <ResponsiveHorizontalCardWrapper
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
                width: "100%",
                height: "100%",
                flex: "auto !important",
              }}
            >
              <CompanyCardSkeleton key={i} />
            </Box>
          ))
        ) : allCompanies.length > 0 ? (
          allCompanies.map((company, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                flex: "auto !important",
              }}
            >
              <CompanyCard company={company} />
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
            לא נמצאו חברות
          </Box>
        )}
      </ResponsiveHorizontalCardWrapper>
    </SectionWrapper>
  );
};

export default CompanySectionWrapper;
