"use client";

import { useState } from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { SearchBar } from "@/components/search-bar";
import { useTheme } from "@mui/material/styles";
import type {
  NeedMoreInfoResponse,
  PriceResponse,
} from "../../lib/types/price-analyzer";

export default function PriceAnalyzerComponent() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dynamicSelects, setDynamicSelects] = useState<NeedMoreInfoResponse[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [priceResult, setPriceResult] = useState<PriceResponse | null>(null);

  // Computed group price range values for the chart
  const minGroupPrice = priceResult ? Math.round((priceResult.minGroupPrice)) : 0;
  const averageGroupPrice = priceResult ? Math.round(priceResult.averageGroupPrice) : 0;
  const maxGroupPrice = priceResult ? Math.round((priceResult.maxGroupPrice)) : 0;
  const maxVal = Math.max(minGroupPrice, averageGroupPrice, maxGroupPrice) || 1;
  const calculatePercentage = (v: number) => `${Math.max(5, Math.round((v / maxVal) * 100))}%`;

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
        // צריך מידע נוסף - הוסף select חדש
        setDynamicSelects((prev) => [...prev, data as NeedMoreInfoResponse]);
      } else {
        // קיבלנו תוצאה סופית
        setPriceResult(data as PriceResponse);
        setDynamicSelects([]); // נקה את ה-selects
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
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
        // צריך עוד מידע - הוסף select נוסף
        const alreadyExists = dynamicSelects.some(
          (opt) => opt.category === data.category
        );
        if (!alreadyExists) {
          setDynamicSelects((prev) => [...prev, data as NeedMoreInfoResponse]);
        }
      } else {
        // קיבלנו תוצאה סופית
        setPriceResult(data as PriceResponse);
        setDynamicSelects([]); // נקה את ה-selects
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
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
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
      {/* Search Bar */}
      <Card
        sx={{
          p: 1,
          mb: 3,
          boxShadow: 3,
          borderRadius: "12px",
          border: "2px solid transparent",
          "&:hover": { borderColor: "#1a2a5a" },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar
              searchText={searchText}
              placeholderText="חפש מוצר (למשל: אוטו, טלפון, מחשב נייד...)"
              handleSearchTextChange={setSearchText}
            />
          </Box>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !searchText.trim()}
            startIcon={
              loading ? <CircularProgress size={20} /> : <SearchIcon />
            }
            sx={{ minWidth: 120 }}
          >
            {loading ? "מחפש..." : "חפש"}
          </Button>
        </Box>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
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
                          e.target.value
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
                        "__SKIP_DETAILS__"
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
                        "__SKIP_DETAILS__"
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
            p: 3,
            boxShadow: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {priceResult.productName}
          </Typography>

          <Chip
            label={priceResult.category}
            sx={{
              mb: 3,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          />

          <Divider sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.3)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                מחיר מקורי
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                ₪{priceResult.estimatedPrice.toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <LocalOfferIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  הנחה קבוצתית
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#ffd700" }}
              >
                {priceResult.groupDiscount}%
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  מחיר סופי
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#4ade80" }}
              >
                ₪{priceResult.averageGroupPrice.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.3)" }} />

          {/* Expected Group Price Range */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              טווח מחירים צפוי
            </Typography>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ minWidth: 80, opacity: 0.9 }}>
                  מחיר מינימלי
                </Typography>
                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 1, position: "relative" }}>
                  <Box sx={{ width: calculatePercentage(minGroupPrice), height: "100%", backgroundColor: "#ffd700", borderRadius: 1 }} />
                </Box>
                <Typography variant="caption">₪{minGroupPrice.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ minWidth: 80, opacity: 0.9 }}>
                  מחיר צפוי
                </Typography>
                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 1, position: "relative" }}>
                  <Box sx={{ width: calculatePercentage(averageGroupPrice), height: "100%", backgroundColor: "#4ade80", borderRadius: 1 }} />
                </Box>
                <Typography variant="caption">₪{averageGroupPrice.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ minWidth: 80, opacity: 0.9 }}>
                  מחיר מקסימלי
                </Typography>
                <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 1, position: "relative" }}>
                  <Box sx={{ width: calculatePercentage(maxGroupPrice), height: "100%", backgroundColor: "#f87171", borderRadius: 1 }} />
                </Box>
                <Typography variant="caption">₪{maxGroupPrice.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
            {priceResult.notes}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
                flexGrow: 1,
              }}
              onClick={handleReset}
            >
              חיפוש חדש
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              צור קבוצת רכישה
            </Button>
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
      {!searchText &&
        !loading &&
        dynamicSelects.length === 0 &&
        !priceResult && (
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
              השתמש בחיפוש החכם שלנו כדי למצוא את המוצר המושלם ולהצטרף לקבוצת
              רכישה שתחסוך לך כסף
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
                    onClick={() => setSearchText(category)}
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "white",
                      },
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      py: 1,
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
                    onClick={() => setSearchText(example)}
                    variant="outlined"
                    sx={{
                      borderColor: "secondary.main",
                      color: "secondary.main",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        color: "white",
                        borderColor: "secondary.main",
                      },
                      cursor: "pointer",
                      fontSize: "0.8rem",
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
                למצוא את המחיר הטוב ביותר דרך קבוצת רכישה
              </Typography>
            </Box>
          </Card>
        )}
    </Box>
  );
}
