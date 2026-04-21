"use client";

import { Suspense, useState, useEffect } from "react";
import { Alert, Box } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { Company } from "lib/dal";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import CompanyCardSkeleton from "@/components/skeleton/company-card-skeleton";
import CompanyCard from "@/components/card/company-card";
import { MAX_PAGINATION_LIMIT } from "../config/pagination";

export default function Page() {
    const headerText = "חברות שותפות";
    const descriptionText = "גלו את השותפים העסקיים שלנו.";

    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        // TODO: We don't want to paginate the companies page, keep it like this until needed
        fetch(`/api/companies?limit=${MAX_PAGINATION_LIMIT.toString()}`)
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
            <DefaultPageBanner
                header={headerText}
                description={descriptionText}
            />
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
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    color: "text.secondary",
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
