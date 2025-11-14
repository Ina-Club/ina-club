"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { Alert, Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { GroupFilters } from "@/components/group-filters";
import ActiveGroupCard from "@/components/card/active-group-card";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";
import { applyFilters } from "lib/filters";
import { FilterState } from "@/components/group-filters/filters";
import { ActiveGroup, Company } from "lib/dal";
import { SearchBar } from "@/components/search-bar";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import CompanyCardSkeleton from "@/components/skeleton/company-card-skeleton";
import CompanyCard from "@/components/card/company-card";

export default function Page() {
    const headerText = "חברות שותפות";
    const descriptionText =
        "גלה את החברות המובילות ";

    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetch("/api/companieas")
            .then((r) => r.json())
            .then((data) => {
                if (active) setAllCompanies(data.companies ?? []);
            })
            .catch(() => {
                setError("שגיאה בשליפת חברות.");
                setAllCompanies([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <DefaultPageBanner header={headerText} description={descriptionText} />
            {/* Content area */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    py: { xs: 1, md: 2 },
                    px: { xs: 2, md: 4 },
                    gap: { xs: 2, md: 4 },
                    alignItems: "center",
                }}
            >
                {/* Cards grid */}
                {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                        flex: 1,
                        px: { xs: 2, md: 2 },
                        justifyContent: "center",
                        alignItems: "center",
                        gap: { xs: 3, md: 2 },
                    }}
                >
                    <Suspense fallback={<GroupSectionSkeleton />}>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <CompanyCardSkeleton key={i} />
                            ))
                        ) : allCompanies.length > 0 ? (
                            allCompanies.map((company, index) => (
                                <CompanyCard key={index} company={company} />
                            ))
                        ) : (
                            <Box
                                sx={{
                                    // position: "absolute",
                                    // left: "50%",
                                    width: "100%",
                                    // transform: "translateX(-50%)",
                                    // mb: { xs: 4, md: 2 },
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    color: "text.secondary",
                                    // textAlign: "center",
                                }}
                            >
                                לא נמצאו חברות
                            </Box>
                        )}
                    </Suspense>
                </Box>
            </Box>
        </>
    );
}
