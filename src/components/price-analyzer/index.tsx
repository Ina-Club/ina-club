"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as LocalOfferIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import { SearchBar } from "@/components/search-bar";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/contexts/snackbar-context";
import { formatShekelAmount } from "@/lib/utils/currency";
import confetti from "canvas-confetti";
import type {
  NeedMoreInfoResponse,
  PriceResponse,
} from "../../lib/types/price-analyzer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

interface UserStatus {
  isSignedIn: boolean;
  canSubmitWishItem: boolean;
  wishItemViolationBlocked: boolean;
  wishItemQuotaReached: boolean;
  remainingWishItems: number;
  canAnalyzePrice: boolean;
  priceAnalysisQuotaReached: boolean;
  remainingPriceAnalysis: number;
}

export default function PriceAnalyzerComponent() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dynamicSelects, setDynamicSelects] = useState<NeedMoreInfoResponse[]>(
    [],
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [priceResult, setPriceResult] = useState<PriceResponse | null>(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const [dialog, setDialog] = useState<{
    open: boolean;
    type: "success" | "blocked" | "error" | null;
    title?: string;
    description?: string;
  }>({ open: false, type: null });

  // Fetch status on mount
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

  const refreshUserStatus = async () => {
    try {
      const res = await fetch("/api/user-status");
      const data = await res.json();
      setUserStatus(data);
    } catch { }
  };

  const closeDialog = () => setDialog({ open: false, type: null });

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#1a2a5a", "#3b5cc4", "#f0a500", "#ffffff"],
    });
  };

  // Computed group price range values for the chart
  const minGroupPrice = priceResult ? Math.round(priceResult.minGroupPrice) : 0;
  const averageGroupPrice = priceResult
    ? Math.round(priceResult.averageGroupPrice)
    : 0;
  const maxGroupPrice = priceResult ? Math.round(priceResult.maxGroupPrice) : 0;
  // Making sure to extract the maximum price for the chart
  const highestPrice =
    Math.max(minGroupPrice, averageGroupPrice, maxGroupPrice) || 1;
  const calculateChartFillPercentage = (v: number) =>
    `${Math.max(5, Math.round((v / highestPrice) * 100))}%`;

  const isBlocked = statusLoading || !userStatus ? true : userStatus.priceAnalysisQuotaReached;

  const readyForSearch: boolean = !!searchText.trim() && !loading && !isBlocked;

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError("אנא הזן מוצר לחיפוש");
      return;
    }

    setLoading(true);
    setError(null);
    setPriceResult(null);

    try {
      const response = await fetch("/api/ai/price-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: searchText,
          context: selectedValues,
        }),
      });

      if (!response.ok) {
        throw new Error("שגיאה בחיפוש");
      }

      const data = await response.json();

      if (data.needsMoreInfo) {
        setDynamicSelects((prev) => [...prev, data as NeedMoreInfoResponse]);
      } else {
        setPriceResult(data as PriceResponse);
        setSelectedValues({});
        setDynamicSelects([]);
      }
      refreshUserStatus(); // Refresh to update remaining count
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "לא ניתן לנתח מחיר לערך זה");
      refreshUserStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = async (category: string, value: string) => {
    const newSelectedValues = { ...selectedValues, [category]: value };
    setSelectedValues(newSelectedValues);

    // שלח שוב לשרת עם ה-context המעודכן
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/price-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: searchText,
          context: newSelectedValues,
        }),
      });

      if (!response.ok) {
        throw new Error("שגיאה בחיפוש");
      }

      const data = await response.json();

      if (data.needsMoreInfo) {
        const alreadyExists = dynamicSelects.some(
          (opt) => opt.category === data.category,
        );
        if (!alreadyExists) {
          setDynamicSelects((prev) => [...prev, data as NeedMoreInfoResponse]);
        }
      } else {
        setPriceResult(data as PriceResponse);
        setSelectedValues({});
        setDynamicSelects([]);
      }
      refreshUserStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "לא ניתן לנתח מחיר לערך זה");
      refreshUserStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchText("");
    setDynamicSelects([]);
    setSelectedValues({});
    setPriceResult(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleCreateWishItem = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!priceResult) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wish-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `מחפש ${priceResult.productName}`,
          targetPrice: averageGroupPrice, // use the suggested group price
        }),
      });

      const data = await res.json();
      await refreshUserStatus();

      if (res.ok) {
        fireConfetti();
        setDialog({
          open: true,
          type: "success",
          title: "הבקשה פורסמה בהצלחה",
          description: "המוצר נוסף בהצלחה ל-Wish Items של הקהילה!",
        });
      } else if (res.status === 409) {
        setDialog({
          open: true,
          type: "blocked",
          title: "לא ניתן לפרסם",
          description: "בקשה דומה כבר קיימת במערכת.",
        });
      } else if (res.status === 429) {
        setDialog({
          open: true,
          type: "blocked",
          title: "הגעת למכסה היומית",
          description: "ניתן לפרסם שוב מחר.",
        });
      } else if (res.status === 422 || res.status === 403) {
        setDialog({
          open: true,
          type: "blocked",
          title: "הבקשה נדחתה",
          description: data.error || "הבקשה לא עומדת בכללי הקהילה.",
        });
      } else {
        throw new Error("אירעה שגיאה ביצירת הבקשה.");
      }
    } catch (err: any) {
      setDialog({
        open: true,
        type: "error",
        title: "אירעה שגיאה",
        description: "נסה שוב בעוד מספר רגעים.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
      {isSignedIn ? (
        <Box sx={{ position: "relative", width: "100%" }}>
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
              ניתן לנתח עד 2 פעמים ביום {userStatus.remainingPriceAnalysis !== undefined ? `(נותרו ${userStatus.remainingPriceAnalysis})` : ""}
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
              if (e.key === "Enter" && readyForSearch) handleSearch();
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ flexGrow: 1 }}>
                <SearchBar
                  searchText={searchText}
                  placeholderText={statusLoading
                    ? "חפשו מוצר (למשל: אוטו, טלפון, מחשב נייד...)"
                    :  userStatus?.priceAnalysisQuotaReached
                        ? "הגעת למכסת ניתוחי המחיר היומית — ניתן לנתח שוב מחר"
                        : "חפשו מוצר (למשל: אוטו, טלפון, מחשב נייד...)"}
                  handleSearchTextChange={setSearchText}
                  disabled={isBlocked}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!readyForSearch}
                startIcon={
                  <SearchIcon />
                }
                sx={{ minWidth: 120 }}
              >
                {loading ? "מחפש..." : "חפשו"}
              </Button>
            </Box>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
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
            כדי להתחיל לנתח מחירים
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Card
          sx={{
            p: 3,
            mb: 3,
            maxWidth: 480,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "primary.light", // #BED6E9
              bgcolor: "#BED6E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <BlockIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>

          <Typography variant="h2" sx={{ mb: 0.75 }}>
            שגיאה בניתוח המחיר
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}>
            {error}
          </Typography>
        </Card>
      )}

      {/* Dynamic Selects */}
      {dynamicSelects.length > 0 && (
        <Card sx={{ p: 3, mb: 3, boxShadow: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <SearchIcon color="primary" />
            בואו נדייק את החיפוש
          </Typography>

          {dynamicSelects.map((option, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {option.message}
              </Typography>

              {option.options && option.options.length > 0 ? (
                // יש אפשרויות לבחירה - הצג Select עם אופציות
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>{option.category}</InputLabel>
                    <Select
                      value={selectedValues[option.category || ""] || ""}
                      label={option.category}
                      onChange={(e) =>
                        handleSelectChange(
                          option.category || "",
                          e.target.value,
                        )
                      }
                      disabled={loading}
                    >
                      {option.options.map((opt: string) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* כפתור לדילוג על הפרטים */}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() =>
                      handleSelectChange(
                        option.category || "",
                        "דלג על הפרטים",
                      )
                    }
                    disabled={loading}
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "primary.main",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    לא משנה לי הפרטים, תן לי הערכה גסה
                  </Button>
                </Box>
              ) : (
                // אין אפשרויות ואין שדות חסרים - הצג אפשרות להערכה גסה
                <Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "warning.light",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2">
                      אנא הזן פרטים נוספים לחיפוש מדויק יותר
                    </Typography>
                  </Box>

                  {/* כפתור לדילוג על הפרטים גם במקרה הזה */}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() =>
                      handleSelectChange(
                        option.category || "",
                        "דלג על הפרטים",
                      )
                    }
                    disabled={loading}
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "primary.main",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    לא משנה לי הפרטים, תן לי הערכה גסה בכל זאת
                  </Button>
                </Box>
              )}
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            {Object.entries(selectedValues).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => {
                  const newValues = { ...selectedValues };
                  delete newValues[key];
                  setSelectedValues(newValues);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Card>
      )}

      {/* Price Result */}
      {priceResult && (
        <Card
          sx={{
            p: { xs: 2, md: 3 },
            boxShadow: "0 18px 42px rgba(26, 42, 90, 0.12)",
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(230, 239, 245, 0.72) 100%)",
            borderRadius: "24px",
            border: "1px solid rgba(190, 214, 233, 0.9)",
            color: "text.primary",
          }}
        >
          <Box
            sx={{
              mb: 3,
              p: { xs: 2, md: 2.5 },
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(26, 42, 90, 0.96) 0%, rgba(36, 58, 122, 0.96) 100%)",
              color: "white",
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
              סיכום ניתוח
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, mb: 1, fontWeight: 700 }}>
              {priceResult.productName}
            </Typography>

            <Chip
              label={priceResult.category}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.14)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(26, 42, 90, 0.12)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(190, 214, 233, 0.8)",
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                מחיר מקורי
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                {formatShekelAmount(priceResult.estimatedPrice)}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(190, 214, 233, 0.8)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <LocalOfferIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  הנחה קבוצתית
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "secondary.dark" }}
              >
                {priceResult.groupDiscount}%
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(190, 214, 233, 0.8)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  מחיר סופי
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {formatShekelAmount(priceResult.averageGroupPrice)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "rgba(26, 42, 90, 0.12)" }} />

          {/* Expected Group Price Range */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "primary.main" }}>
              טווח מחירים צפוי
            </Typography>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ minWidth: 80, color: "text.secondary" }}
                >
                  מחיר מינימלי
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    backgroundColor: "rgba(190, 214, 233, 0.45)",
                    borderRadius: 1,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: calculateChartFillPercentage(minGroupPrice),
                      height: "100%",
                      backgroundColor: theme.palette.secondary.main,
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
                  {formatShekelAmount(minGroupPrice)}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ minWidth: 80, color: "text.secondary" }}
                >
                  מחיר צפוי
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    backgroundColor: "rgba(190, 214, 233, 0.45)",
                    borderRadius: 1,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: calculateChartFillPercentage(averageGroupPrice),
                      height: "100%",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
                  {formatShekelAmount(averageGroupPrice)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ minWidth: 80, color: "text.secondary" }}
                >
                  מחיר מקסימלי
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    backgroundColor: "rgba(190, 214, 233, 0.45)",
                    borderRadius: 1,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: calculateChartFillPercentage(maxGroupPrice),
                      height: "100%",
                      backgroundColor: "#d9822b",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
                  {formatShekelAmount(maxGroupPrice)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              color: "text.secondary",
              backgroundColor: "rgba(255,255,255,0.68)",
              border: "1px solid rgba(190, 214, 233, 0.7)",
              borderRadius: "18px",
              p: 2,
            }}
          >
            {priceResult.notes}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
                flexGrow: 1,
              }}
              onClick={handleReset}
            >
              חיפוש חדש
            </Button>
            <Button
              variant="outlined"
              onClick={handleCreateWishItem}
              disabled={loading || !userStatus?.canSubmitWishItem}
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(26, 42, 90, 0.04)",
                },
              }}
            >
              {userStatus?.canSubmitWishItem ? "בקש מוצר זה ב-Wish Items" : "לא ניתן לפתוח בקשה כעת"}
            </Button>
          </Box>

          <Divider
            sx={{ mt: 3, mb: 1.5, borderColor: "rgba(26, 42, 90, 0.12)" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 16, color: "rgba(26, 42, 90, 0.72)" }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(26, 42, 90, 0.72)" }}
            >
              מידע שנוצר על ידי בינה מלאכותית עלול להכיל אי־דיוקים והוא מיועד
              למטרות מידע בלבד. מומלץ לאמת פרטים ומחירים מול מקורות רשמיים.
            </Typography>
          </Box>
        </Card>
      )}

      {/* Loading State */}
      {loading && !dynamicSelects.length && !priceResult && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Welcome Section - מוצג רק כשאין חיפוש פעיל */}
      {!loading && dynamicSelects.length === 0 && !priceResult && !error && (
        <Card
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "2px solid",
            borderColor: "primary.light",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
          >
            מה תרצה לחפש היום?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            השתמש במנתח המחירים שלנו כדי להבין מהו המחיר הממוצע של המוצר או השירות שאתה מחפש ולהצטרף לקבוצת רכישה שתחסוך לך כסף.
          </Typography>

          {/* Popular Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              קטגוריות פופולריות
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                "סמארטפונים",
                "מחשבים ניידים",
                "טלוויזיות",
                "מכונות כביסה",
                "מקררים",
                "מזגנים",
                "רכבים",
                "אופניים חשמליים",
              ].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => !isBlocked && setSearchText(category)}
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: isBlocked ? "primary.light" : "primary.main",
                      color: isBlocked ? "primary.main" : "white",
                    },
                    cursor: isBlocked ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    py: 1,
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Search Examples */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              דוגמאות לחיפוש
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                "אייפון 15 פרו מקס",
                "מקבוק אייר M3",
                "טלוויזיה 65 אינץ' Samsung",
                "מכונת כביסה 9 ק״ג",
                "מקרר דלת צרדה",
                "מזגן 1.5 כ״ס",
              ].map((example) => (
                <Chip
                  key={example}
                  label={example}
                  onClick={() => !isBlocked && setSearchText(example)}
                  variant="outlined"
                  sx={{
                    borderColor: "secondary.main",
                    color: "secondary.main",
                    "&:hover": {
                      bgcolor: isBlocked ? "transparent" : "secondary.main",
                      color: isBlocked ? "secondary.main" : "white",
                      borderColor: "secondary.main",
                    },
                    cursor: isBlocked ? "not-allowed" : "pointer",
                    fontSize: "0.8rem",
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* How it works */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "#fff7ec", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "secondary.main", fontWeight: 500 }}
            >
              איך זה עובד? פשוט תחפש את המוצר שמעניין אותך, ואנחנו נעזור לך
              למצוא את המחיר הטוב ביותר דרך קבוצת רכישה.
            </Typography>
          </Box>
        </Card>
      )}
      {/* Dialog */}
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        PaperProps={{
          sx: {
            borderRadius: "22px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
            border: "1px solid rgba(15,23,42,0.06)",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: dialog.type === "success"
              ? "linear-gradient(135deg, #22c55e, #16a34a)"
              : "linear-gradient(135deg, #ef4444, #b91c1c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
            boxShadow: dialog.type === "success"
              ? "0 8px 24px rgba(34,197,94,0.4)"
              : "0 8px 24px rgba(239,68,68,0.4)",
          }}
        >
          {dialog.type === "success" ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "white" }} />
          ) : (
            <BlockIcon sx={{ fontSize: 44, color: "white" }} />
          )}
        </Box>

        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem", p: 0, mb: 1 }}>
          {dialog.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            {dialog.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={closeDialog}
            sx={{
              background: "linear-gradient(135deg, #f0a500, #e09000)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              py: 1.2,
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(240,165,0,0.4)",
              "&:hover": { background: "linear-gradient(135deg, #e09000, #c07800)" },
            }}
          >
            {dialog.type === "success" ? "מעולה!" : "הבנתי"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
