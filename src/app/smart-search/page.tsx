"use client";

import { Suspense, useEffect, useState } from "react";
import { Box, Button, Card, CircularProgress, Container, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { SearchBar } from "@/components/search-bar";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import ActiveGroupCard from "@/components/card/active-group-card";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";
import RequestGroupCard from "@/components/card/request-group-card";
import RequestGroupCardSkeleton from "@/components/skeleton/request-group-card-skeleton";
import { ActiveGroup, RequestGroup } from "lib/dal";
import { toPublicGroups } from "lib/transformers/group";
import { LoadingCircle } from "@/components/loading-circle";
import { SMART_SEARCH_PROMPT } from "ai/prompts";

export default function SmartSearchPage() {
    const headerText: string = "חיפוש חכם";
    const descriptionText: string = "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";
    const [searchText, setSearchText] = useState("");
    const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
    const [requestGroups, setRequestGroups] = useState<RequestGroup[]>([]);
    const [loadingActive, setLoadingActive] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [displayHelp, setDisplayHelp] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorActive, setErrorActive] = useState<string | null>(null);
    const [errorRequests, setErrorRequests] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoadingActive(true);
        setErrorActive(null);
        fetch("/api/active-groups/?status=open")
            .then((r) => r.json())
            .then((data) => {
                if (active) setActiveGroups(data.activeGroups ?? []);
            })
            .catch(() => {
                if (active) setErrorActive("שגיאה בטעינת קבוצות פעילות");
            })
            .finally(() => {
                if (active) setLoadingActive(false);
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        setLoadingRequests(true);
        setErrorRequests(null);
        fetch("/api/request-groups/?status=open")
            .then((r) => r.json())
            .then((data) => {
                if (active) setRequestGroups(data.requestGroups ?? []);
            })
            .catch(() => {
                if (active) setErrorRequests("שגיאה בטעינת בקשות");
            })
            .finally(() => {
                if (active) setLoadingRequests(false);
            });
        return () => {
            active = false;
        };
    }, []);

    // Currently we dont wait for this to end when we call this, we can change this is the future if required.
    const handleSmartSearch = async () => {
        setLoadingSearch(true);
        setDisplayHelp(false);
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
            console.log(JSON.stringify(toPublicGroups(requestGroups)));
            const response: Response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: smartSearchPrompt, schema: responseSchema }),
            });
            const data = await response.json();
            if (!response.ok || data.requestGroups === undefined || data.activeGroups === undefined) {
                console.log("Failed to fetch AI data: ", response.statusText);
                // setError()
            }
            else {
                // Using sets for O(1) access to a group by it's ID.
                const serverRequestGroupIds: Set<string> = new Set(data.requestGroups);
                const serverActiveGroupIds: Set<string> = new Set(data.activeGroups);
                const filteredRequestGroups: RequestGroup[] = requestGroups.filter((rg) => serverRequestGroupIds.has(rg.id));
                const filteredActiveGroups: ActiveGroup[] = activeGroups.filter((ag) => serverActiveGroupIds.has(ag.id));
                setRequestGroups(filteredRequestGroups);
                setActiveGroups(filteredActiveGroups);
            }
            setLoadingSearch(false);
        }
        catch (err) {
            console.log("Failed Sending the request to AI!", err);
            // setError()
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
                    if (e.key === "Enter") handleSmartSearch();
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
                    disabled={!searchText.trim() || loadingActive || loadingRequests}
                >
                    {(loadingActive || loadingRequests) ? <CircularProgress size={25} /> : 'חיפוש'}
                </Button>
            </Box>

            {displayHelp ? (
                <Container maxWidth="md" sx={{ mb: 6 }}>
                    <Card sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                            איך להשתמש בחיפוש החכם
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            הזינו טקסט חופשי ולחצו על כפתור "חיפוש" כדי לראות תוצאות.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            דוגמאות שאפשר לנסות:
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, m: 0 }}>
                            <li>
                                <Typography variant="body2">"מכונית עד 5000 ש"ח" — מציג קבוצות פעילות עד מחיר זה ובקשות רלוונטיות.</Typography>
                            </li>
                            <li>
                                <Typography variant="body2">"אוזניות ביטול רעשים" — חיפוש לפי שם מוצר/קטגוריה/תיאור.</Typography>
                            </li>
                        </Box>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            מה יוצג לאחר חיפוש?
                        </Typography>
                        <Box component="ul" sx={{ pl: 3, m: 0 }}>
                            <li>
                                <Typography variant="body2">קבוצות פעילות רלוונטיות בצד שמאל.</Typography>
                            </li>
                            <li>
                                <Typography variant="body2">בקשות רלוונטיות בצד ימין.</Typography>
                            </li>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            טיפ: ניתן גם ללחוץ Enter כדי לבצע חיפוש.
                        </Typography>
                    </Card>
                </Container>
            ) : !loadingSearch ? (
                // Two-column results: left Active, right Requests
                <Container maxWidth="lg" sx={{ mb: 6 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: { xs: 3, md: 4 },
                            alignItems: "start",
                        }}
                    >
                        {/* Active Groups (left) */}
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                קבוצות פעילות רלוונטיות
                            </Typography>
                            {errorActive && (
                                <Card sx={{ p: 2, mb: 2, bgcolor: "#fff7f7", color: "#b71c1c" }}>
                                    <Typography variant="body2">{errorActive}</Typography>
                                </Card>
                            )}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: { xs: 2, md: 2 },
                                }}
                            >
                                <Suspense fallback={<GroupSectionSkeleton />}>
                                    {loadingActive ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <ActiveGroupCardSkeleton key={i} />
                                        ))
                                    ) : activeGroups.length > 0 ? (
                                        activeGroups.map((ag, i) => (
                                            <ActiveGroupCard key={i} activeGroup={ag} />
                                        ))
                                    ) : (
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            לא נמצאו קבוצות פעילות מתאימות
                                        </Typography>
                                    )}
                                </Suspense>
                            </Box>
                        </Box>

                        {/* Request Groups (right) */}
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                בקשות רלוונטיות
                            </Typography>
                            {errorRequests && (
                                <Card sx={{ p: 2, mb: 2, bgcolor: "#fff7f7", color: "#b71c1c" }}>
                                    <Typography variant="body2">{errorRequests}</Typography>
                                </Card>
                            )}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: { xs: 2, md: 2 },
                                }}
                            >
                                <Suspense fallback={<GroupSectionSkeleton />}>
                                    {loadingRequests ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <RequestGroupCardSkeleton key={i} />
                                        ))
                                    ) : requestGroups.length > 0 ? (
                                        requestGroups.map((rg, i) => (
                                            <RequestGroupCard key={i} requestGroup={rg} />
                                        ))
                                    ) : (
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            לא נמצאו בקשות מתאימות
                                        </Typography>
                                    )}
                                </Suspense>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            ) : (<LoadingCircle loadingText="מחפש..." />)
            }
        </>
    );
}

