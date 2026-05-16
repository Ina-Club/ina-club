"use client";

import { Box } from "@mui/material";
import SectionWrapper from "./section-wrapper";
import ResponsiveHorizontalCardWrapper from "./responsive-horizontal-card-wrapper";
import CompanyCard from "../card/company-card";
import { Company } from "lib/dal";
import { useState, useEffect } from "react";
import CompanyCardSkeleton from "../skeleton/company-card-skeleton";

interface CompanySectionWrapperProps { }

const POPULAR_COMPANIES_AMOUNT = 5;

const CompanySectionWrapper: React.FC<CompanySectionWrapperProps> = ({ }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      limit: POPULAR_COMPANIES_AMOUNT.toString(),
    });

    try {
      const res = await fetch("/api/companies/?" + params.toString());
      const data = await res.json();
      setCompanies(data.companies ?? []);
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <SectionWrapper
      title={`חברות מובילות`}
      subTitle={`העסקים והמותגים ששווה להכיר`}
      linkLabel={`צפה בכל החברות`}
      linkUrl={`/companies`}
    >
      <ResponsiveHorizontalCardWrapper gap="16px">
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
        ) : companies.length > 0 ? (
          companies.map((company, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
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
