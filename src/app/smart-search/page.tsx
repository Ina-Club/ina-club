"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Container, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { SearchBar } from "@/components/search-bar";
import GroupSectionSkeleton from "@/components/skeleton/group-section-skeleton";
import ActiveGroupCard from "@/components/card/active-group-card";
import ActiveGroupCardSkeleton from "@/components/skeleton/active-group-card-skeleton";
import RequestGroupCard from "@/components/card/request-group-card";
import RequestGroupCardSkeleton from "@/components/skeleton/request-group-card-skeleton";
import { ActiveGroup, RequestGroup } from "lib/dal";
import { filterByText } from "lib/filters/text";

// Kept for compatibility with SmartSearchCard (if referenced elsewhere)
export interface AIProductData {
  name: string;
  model: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  notesInHebrew: string;
}

export default function SmartSearchPage() {
  const headerText: string = "חיפוש חכם";
  const descriptionText: string =
    "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";

  // Input text vs. submitted query text
  const [searchText, setSearchText] = useState("");
  const [queryText, setQueryText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [allActiveGroups, setAllActiveGroups] = useState<ActiveGroup[]>([]);
  const [allRequestGroups, setAllRequestGroups] = useState<RequestGroup[]>([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorActive, setErrorActive] = useState<string | null>(null);
  const [errorRequests, setErrorRequests] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingActive(true);
    setErrorActive(null);
    fetch("/api/active-groups")
      .then((r) => r.json())
      .then((data) => {
        if (active) setAllActiveGroups(data.activeGroups ?? []);
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
    fetch("/api/request-groups")
      .then((r) => r.json())
      .then((data) => {
        if (active) setAllRequestGroups(data.requestGroups ?? []);
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

  // Extract a max price if the query contains something like "עד 5000" or "<= 5000"
  const parsedMaxPrice = useMemo(() => {
    const text = queryText.trim();
    if (!text) return null as number | null;
    const numberMatch = text.match(/\d{3,}/g); // basic number capture (>= 3 digits)
    if (!numberMatch) return null;
    if (/עד|<=|פחות|מתחת/i.test(text)) {
      const n = parseInt(numberMatch[numberMatch.length - 1], 10);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }, [queryText]);

  const filteredActiveGroups = useMemo(() => {
    if (!hasSearched) return [] as ActiveGroup[];
    let items = filterByText(allActiveGroups, queryText);
    if (parsedMaxPrice != null) {
      items = items.filter((ag) => {
        const price = typeof ag.groupPrice === "number" ? ag.groupPrice : (ag as any).price;
        return typeof price === "number" ? price <= parsedMaxPrice : true;
      });
    }
    return items;
  }, [allActiveGroups, hasSearched, queryText, parsedMaxPrice]);

  const filteredRequestGroups = useMemo(() => {
    if (!hasSearched) return [] as RequestGroup[];
    // Text-based filtering only (API doesn't expose prices for opened groups)
    return filterByText(allRequestGroups, queryText);
  }, [allRequestGroups, hasSearched, queryText]);

  const triggerSearch = () => {
    setQueryText(searchText);
    setHasSearched(true);
  };

  return (
    <>
      <DefaultPageBanner header={headerText} description={descriptionText} />

      {/* Search bar */}
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
          if (e.key === "Enter") triggerSearch();
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
          onClick={triggerSearch}
          sx={{ ml: 1, whiteSpace: "nowrap" }}
          disabled={!searchText.trim()}
        >
          חיפוש
        </Button>
      </Box>

      {!searchText ? (
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
      ) : (
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
                  ) : filteredActiveGroups.length > 0 ? (
                    filteredActiveGroups.map((ag, i) => (
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
                  ) : filteredRequestGroups.length > 0 ? (
                    filteredRequestGroups.map((rg, i) => (
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
      )}
    </>
  );
}

