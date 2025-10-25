"use client";

import { Box } from "@mui/material";
import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalListWrapper from "./responsive-horizontal-wrapper";
import CompanyCard from "../card/company-card";
import { Company } from "lib/dal";
import { useState, useEffect } from "react";
import { LoadingCircle } from "../loading-circle";
import CompanyCardSkeleton from "../skeleton/company-card-skeleton";

interface CompanySectionWrapperProps {}

const CompanySectionWrapper: React.FC<CompanySectionWrapperProps> = ({}) => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        if (active) setAllCompanies(data.companies ?? []);
      })
      .catch(() => setAllCompanies([]))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <SectionWrapper
      title={`חברות מובילות`}
      subTitle={`הסטארטאפים והמותגים ששווה להכיר`}
      linkLabel={`צפה בכל החברות`}
      linkUrl={`/companies`}
    >
      <ResponsiveHorizontalListWrapper gap="16px">
        {loading ? (
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
      </ResponsiveHorizontalListWrapper>
    </SectionWrapper>
  );
};

export default CompanySectionWrapper;
