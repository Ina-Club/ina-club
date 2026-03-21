"use client";

import { useState } from "react";
import { Box, Button, Card } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { SearchBar } from "@/components/search-bar";
import { ActiveGroup, } from "lib/dal";
import { LoadingCircle } from "@/components/loading-circle";
import { SmartSearchHelper } from "@/components/smart-search/helper";
import { SmartSearchComponent } from "@/components/smart-search";
import { WishItemData } from "@/components/demand-pulse/WishItemCard";

export default function SmartSearchPage() {
    const headerText: string = "חיפוש חכם";
    const descriptionText: string = "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";
    const [searchText, setSearchText] = useState("");
    const [displayedActiveGroups, setDisplayedActiveGroups] = useState<ActiveGroup[]>([]);
    const [displayedWishItems, setDisplayedWishItems] = useState<WishItemData[]>([]);
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
            if (!response.ok || data.activeGroups == undefined || data.filtered == undefined) {
                throw new Error(`${response.status}`);
            }
            if (data.filtered) setFilterAi(true);
            setDisplayedWishItems(data.wishItems || []);
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
            <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", px: { xs: 2, md: 0 }, bgcolor: "white" }}>
                <Card
                    sx={{
                        p: 1,
                        mt: -4,
                        mb: 3,
                        boxShadow: 3,
                        borderRadius: "12px",
                        position: "relative",
                        border: "2px solid transparent",
                        "&:hover": { borderColor: "#1a2a5a" },
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" && readyForSearch) handleSmartSearch();
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <SearchBar
                                searchText={searchText}
                                placeholderText="חפשו טקסט חופשי..."
                                handleSearchTextChange={setSearchText}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={handleSmartSearch}
                            sx={{ minWidth: 120 }}
                            disabled={!readyForSearch}
                        >
                            {loadingSearch ? "מחפש..." : "חיפוש"}
                        </Button>
                    </Box>
                </Card>
            </Box>

            {displayHelper ?
                <SmartSearchHelper />
                : (!loadingSearch ?
                    <SmartSearchComponent
                        filterAi={filterAi}
                        errorAi={errorAi}
                        displayedActiveGroups={displayedActiveGroups}
                        displayedWishItems={displayedWishItems}
                    />
                    :
                    <LoadingCircle loadingText="מחפש..." />)
            }
        </>
    );
}

