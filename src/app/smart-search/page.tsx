"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { SearchBar } from "@/components/search-bar";
import { ActiveGroup, RequestGroup } from "lib/dal";
import { toPublicGroups } from "lib/transformers/group";
import { LoadingCircle } from "@/components/loading-circle";
import { SMART_SEARCH_PROMPT } from "ai/prompts";
import { SmartSearchHelper } from "@/components/smart-search/helper";
import { SmartSearchComponent } from "@/components/smart-search";
import { DEFAULT_PAGINATION } from "../config/pagination";

export default function SmartSearchPage() {
    const headerText: string = "חיפוש חכם";
    const descriptionText: string = "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";
    const [searchText, setSearchText] = useState("");
    const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
    const [displayedActiveGroups, setDisplayedActiveGroups] = useState<ActiveGroup[]>([]);
    const [loadingActive, setLoadingActive] = useState(true);
    const [errorActive, setErrorActive] = useState<string | null>(null);
    const [activeCursor, setActiveCursor] = useState<string | null>(null);
    const [requestGroups, setRequestGroups] = useState<RequestGroup[]>([]);
    const [displayedRequestGroups, setDisplayedRequestGroups] = useState<RequestGroup[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [errorRequests, setErrorRequests] = useState<string | null>(null);
    const [requestsCursor, setRequestsCursor] = useState<string | null>(null);
    const [displayHelper, setDisplayHelper] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorAi, setErrorAi] = useState<string | null>(null);

    const readyForSearch: boolean = !!searchText.trim() && !loadingActive && !loadingRequests && !loadingSearch;

    const params = new URLSearchParams({
        status: "open",
        limit: DEFAULT_PAGINATION.toString(),
    });

    const loadActiveGroups = () => {
        setLoadingActive(true);
        setErrorActive(null);
        if (activeCursor) params.set("cursor", activeCursor);
        fetch("/api/active-groups/?" + params.toString())
            .then((r) => r.json())
            .then((data) => { setActiveGroups(data.activeGroups ?? []); })
            .catch(() => { setErrorActive("שגיאה בטעינת קבוצות פעילות"); })
            .finally(() => { setLoadingActive(false); });
    }

    const loadRequestGroups = () => {
        setLoadingRequests(true);
        setErrorRequests(null);
        if (requestsCursor) params.set("cursor", requestsCursor);
        fetch("/api/request-groups/?" + params.toString())
            .then((r) => r.json())
            .then((data) => { setRequestGroups(data.requestGroups ?? []); })
            .catch(() => { setErrorRequests("שגיאה בטעינת בקשות"); })
            .finally(() => { setLoadingRequests(false); });
    }

    useEffect(() => {
        loadActiveGroups();
        loadRequestGroups();
    }, []);

    // Currently we dont wait for this to end when we call this, we can change this is the future if required.
    const handleSmartSearch = async () => {
        setErrorAi(null);
        setLoadingSearch(true);
        setDisplayHelper(false);
        await handleAISearch();
    };

    const handleAISearch = async () => {
        const propertyList: string[] = ["requestGroups", "activeGroups"];
        const responseSchema = {
            type: "object",
            properties: {
                requestGroups: { type: ["string"] },
                activeGroups: { type: ["string"] },
            },
            required: propertyList,
        }
        const smartSearchPrompt: string =
            SMART_SEARCH_PROMPT.replace('{requestGroups}', JSON.stringify(toPublicGroups(requestGroups)))
                .replace('{activeGroups}', JSON.stringify(toPublicGroups(activeGroups)))
                .replace('{searchText}', searchText);
        try {
            const response: Response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: smartSearchPrompt, schema: responseSchema }),
            });
            const data = await response.json();
            if (!response.ok || data.requestGroups === undefined || data.activeGroups === undefined) {
                console.log("Failed to fetch AI data: ", response.statusText);
                setErrorAi("שגיאה בשליפת הנתונים מAI, אנא נסו שנית מאוחר יותר.")
            }
            else {
                // Using sets for O(1) access to a group by it's ID.
                const serverRequestGroupIds: Set<string> = new Set(data.requestGroups);
                const serverActiveGroupIds: Set<string> = new Set(data.activeGroups);
                const filteredRequestGroups: RequestGroup[] = requestGroups.filter((rg) => serverRequestGroupIds.has(rg.id));
                const filteredActiveGroups: ActiveGroup[] = activeGroups.filter((ag) => serverActiveGroupIds.has(ag.id));
                setDisplayedRequestGroups(filteredRequestGroups);
                setDisplayedActiveGroups(filteredActiveGroups);
            }
            setLoadingSearch(false);
        }
        catch (err) {
            console.log("Failed Sending the request to AI!", err);
            setErrorAi("שגיאה בשליפת הנתונים מAI, אנא נסו שנית מאוחר יותר.")
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
                    {(loadingActive || loadingRequests) ? <CircularProgress size={25} /> : 'חיפוש'}
                </Button>
            </Box>

            {displayHelper ?
                <SmartSearchHelper />
                : (!loadingSearch ?
                    <SmartSearchComponent
                        errorActive={errorActive}
                        errorRequests={errorRequests}
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

