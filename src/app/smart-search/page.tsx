"use client";

import { useState, useEffect } from "react";
import { Box, Button, Card, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DefaultPageBanner } from "@/components/default-page-banner";
import { ActiveGroup } from "lib/dal";
import { LoadingCircle } from "@/components/loading-circle";
import { SmartSearchHelper } from "@/components/smart-search/helper";
import { SmartSearchComponent } from "@/components/smart-search";
import { WishItemData } from "@/components/demand-pulse/WishItemCard";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search-bar";

interface UserStatus {
  isSignedIn: boolean;
  canUseSmartSearch: boolean;
  smartSearchQuotaReached: boolean;
  remainingSmartSearch: number;
}

export default function SmartSearchPage() {
  const headerText = "חיפוש חכם";
  const descriptionText =
    "חפשו טקסט חופשי ונציג קבוצות פעילות ובקשות רלוונטיות בהקשר המבוקש.";

  const [searchText, setSearchText] = useState("");
  const [displayedActiveGroups, setDisplayedActiveGroups] = useState<ActiveGroup[]>([]);
  const [displayedWishItems, setDisplayedWishItems] = useState<WishItemData[]>([]);
  const [displayHelper, setDisplayHelper] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorAi, setErrorAi] = useState<string | null>(null);
  const [filterAi, setFilterAi] = useState(false);
  const [focused, setFocused] = useState(false);


  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/user-status")
        .then((res) => res.json())
        .then((data) => setUserStatus(data))
        .catch(() => { })
        .finally(() => setStatusLoading(false));
    } else {
      setStatusLoading(false);
    }
  }, [isSignedIn]);

  const isBlocked =
    statusLoading || !userStatus
      ? true
      : userStatus.smartSearchQuotaReached;

  const readyForSearch =
    !!searchText.trim() && !loadingSearch && !isBlocked;

  const handleAISearch = async () => {
    try {
      const response = await fetch("/api/ai/smart-search", {
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

      fetch("/api/user-status")
        .then((res) => res.json())
        .then((data) => setUserStatus(data))
        .catch(() => { });
    } catch (err: any) {
      console.log("AI error", err);

      setErrorAi(
        err.message === "429"
          ? "הגעת למכסה היומית של החיפוש החכם. נסה שוב מחר."
          : "שגיאה בשליפת הנתונים מAI, אנא נסו שנית מאוחר יותר."
      );
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSmartSearch = async () => {
    setErrorAi(null);
    setFilterAi(false);
    setLoadingSearch(true);
    setDisplayHelper(false);
    await handleAISearch();
  };

  return (
    <>
      <DefaultPageBanner
        header={headerText}
        description={descriptionText}
        hintBullets={[
          "מזינים משפט בעברית ולוחצים חיפוש או Enter.",
          "מוצגות עד ארבע קבוצות ועד ארבע בקשות רלוונטיות.",
          "ממשיכים מכאן בלחיצה על כרטיס לדף קבוצה או בקשה.",
        ]}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          px: { xs: 2, md: 0 },
          bgcolor: "white",
        }}
      >
        {isSignedIn ? (
          <Box sx={{ position: "relative", width: "100%", mt: -4 }}>
            {!statusLoading && userStatus && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -24,
                  right: 8,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                ניתן לחפש עד 2 פעמים ביום {userStatus.remainingSmartSearch !== undefined ? `(נותרו ${userStatus.remainingSmartSearch})` : ""}
              </Typography>
            )}
            <Card
              sx={{
                p: 1,
                mb: 3,
                boxShadow: 3,
                borderRadius: "12px",
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
                    placeholderText={
                      statusLoading ? "חפשו טקסט חופשי..." :
                        userStatus?.smartSearchQuotaReached ? "הגעת למכסה היומית - ניתן לחפש שוב מחר" : "חפשו טקסט חופשי..."
                    }
                    handleSearchTextChange={setSearchText}
                    disabled={isBlocked}
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
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              gap: 1.5,
              mt: -4,
              mb: 3,
              p: "12px 16px",
              borderRadius: "14px",
              border: "1.5px dashed rgba(0,0,0,0.15)",
              cursor: "pointer",
              background: "linear-gradient(-135deg, #ffffff, #f0f4ff)",
              "&:hover": { bgcolor: "rgba(66,100,212,0.07)" },
              transition: "background 0.2s",
            }}
            onClick={() => router.push("/sign-in")}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "rgba(66,100,212,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ✦
            </Box>
            <Typography variant="body2" color="text.secondary">
              <Typography
                component="span"
                variant="body2"
                color="primary.main"
                fontWeight={600}
              >
                התחבר
              </Typography>{" "}
              כדי להתחיל לחפש בקלות
            </Typography>
          </Box>
        )}
      </Box>

      {displayHelper ? (
        <SmartSearchHelper onExampleClick={setSearchText} />
      ) : !loadingSearch ? (
        <SmartSearchComponent
          filterAi={filterAi}
          errorAi={errorAi}
          displayedActiveGroups={displayedActiveGroups}
          displayedWishItems={displayedWishItems}
        />
      ) : (
        <LoadingCircle loadingText="מחפש..." />
      )}
    </>
  );
}