"use client";

import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { SearchBar } from "@/components/search-bar";
import { ActiveGroup, RequestGroup } from "lib/dal";
import { LoadingCircle } from "@/components/loading-circle";
import { SmartSearchHelper } from "@/components/smart-search/helper";
import { SmartSearchComponent } from "@/components/smart-search";

export default function SmartSearchPage() {
    const headerText: string = "חיפוש חכם";
    const descriptionText: string = "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";
    const [searchText, setSearchText] = useState("");
    const [displayedActiveGroups, setDisplayedActiveGroups] = useState<ActiveGroup[]>([]);
    const [displayedRequestGroups, setDisplayedRequestGroups] = useState<RequestGroup[]>([]);
    const [displayHelper, setDisplayHelper] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorAi, setErrorAi] = useState<string | null>(null);
    const [filterAi, setFilterAi] = useState(false);

    const readyForSearch: boolean = !!searchText.trim() && !loadingSearch;
    // Currently we dont wait for this to end when we call this, we can change this is the future if required.
    const handleSmartSearch = async () => {
        setErrorAi(null);
        setFilterAi(false);
        setLoadingSearch(true);
        setDisplayHelper(false);
        await handleAISearch();
    };

    const handleAISearch = async () => {
        try {
            const response: Response = await fetch("/api/ai/smart-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ searchText }),
            });
            const data = await response.json();
            if (!response.ok || data.requestGroups == undefined || data.activeGroups == undefined || data.filtered == undefined) {
                throw new Error(`${response.status}`);
            }
            if (data.filtered) setFilterAi(true);
            setDisplayedRequestGroups(data.requestGroups);
            setDisplayedActiveGroups(data.activeGroups);
        }
        catch (err) {
            console.log("Failed Sending the request to AI!", err);
            setErrorAi("שגיאה בשליפת הנתונים מAI, אנא נסו שנית מאוחר יותר.");
        }
        finally {
            setLoadingSearch(false);
        }
    }

    return (
        <>
            <DefaultPageBanner header={headerText} description={descriptionText} />
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    position: "relative",
                    mt: { xs: -6, md: -3 },
                    mb: 2,
                    bgcolor: "white",
                    boxShadow: 3,
                    borderRadius: "12px",
                    py: { xs: 2, md: 1 },
                    px: { xs: 2, md: 2 },
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid transparent",
                    "&:hover": { borderColor: "#1a2a5a" },
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && readyForSearch) handleSmartSearch();
                }}
            >
                <SearchBar
                    searchText={searchText}
                    placeholderText="חפשו טקסט חופשי..."
                    handleSearchTextChange={setSearchText}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleSmartSearch}
                    sx={{ ml: 1, whiteSpace: "nowrap" }}
                    disabled={!readyForSearch}
                >
                    {loadingSearch ? <CircularProgress size={25} /> : 'חיפוש'}
                </Button>
            </Box>

            {displayHelper ?
                <SmartSearchHelper />
                : (!loadingSearch ?
                    <SmartSearchComponent
                        filterAi={filterAi}
                        errorAi={errorAi}
                        displayedActiveGroups={displayedActiveGroups}
                        displayedRequestGroups={displayedRequestGroups}
                    />
                    :
                    <LoadingCircle loadingText="מחפש..." />)
            }
        </>
    );
}

