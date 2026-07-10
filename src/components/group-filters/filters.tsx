import {
  Box,
  MenuItem,
  Typography,
  styled,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import * as React from "react";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import SearchIcon from "@mui/icons-material/Search";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useEffect, useState } from "react";
import PriceRangeFilter from "./price-range-filter";
import { GroupType } from "./index";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: "none",
  "&::before": { display: "none" },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(() => ({
  minHeight: 55,
  "& .MuiAccordionSummary-content": {
    margin: 0,
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 500,
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transform: "rotate(90deg)",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "3px 14px 14px 18px",
}));

const OptionItem = styled(MenuItem)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  paddingTop: 4,
  paddingBottom: 4,
  "&.Mui-selected": {
    fontWeight: "bold",
    color: theme.palette.text.primary,
    backgroundColor: "white"
  },
}));

import CheckIcon from "@mui/icons-material/Check";

export function toggleVariable<T>(
  setVariable: React.Dispatch<React.SetStateAction<T[]>>,
  value: T
) {
  setVariable(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
}

export interface FilterState {
  searchText: string;
  categories: string[];
  companies: string[];
  statuses: string[];
  participantRange: string;
  priceRange?: [number, number]; // Required in active-groups only
}

interface FiltersProps {
  group: GroupType // There is no default
  filterState?: FilterState;
  onFilterChange?: (filterState: FilterState) => void;
}

export const Filters: React.FC<FiltersProps> = ({ group, filterState, onFilterChange }) => {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [companyList, setCompanyList] = useState<Array<{ id: string; title: string }>>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  const statusOptions = [
    { label: "פתוחה להצטרפות", value: "OPEN" },
    { label: "הופעלה בהצלחה", value: "ACTIVATED" }
  ];

  const participantOptions = [
    { label: "הכל", value: "" },
    { label: "ללא משתתפים עדיין", value: "0" },
    { label: "1-5 משתתפים", value: "1-5" },
    { label: "6-15 משתתפים", value: "6-15" },
    { label: "מעל 15 משתתפים", value: "16+" }
  ];

  const [internalFilterState, setInternalFilterState] = useState<FilterState>({
    searchText: "", //This is part of the FilterState interface. It is required, but won't be changed in this component.
    categories: [],
    companies: [],
    statuses: [],
    participantRange: "",
    ...(group === "active" ? { priceRange: [0, 10_000] } : {})
  });

  const effectiveFilterState = filterState ?? internalFilterState;

  useEffect(() => {
    let active = true;
    fetch("/api/categories")
      .then(r => r.json())
      .then((data) => {
        if (!active) return;
        const names = (data.categories ?? []).map((c: { name: string }) => c.name);
        setCategoryList(names);
      })
      .catch(() => setCategoryList([]));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (group !== "active") return;
    let active = true;
    setLoadingCompanies(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/companies?limit=10&search=${encodeURIComponent(companySearch)}`)
        .then(r => r.json())
        .then((data) => {
          if (!active) return;
          const items = (data.companies ?? []).map((c: { id: string; title: string }) => ({
            id: c.id,
            title: c.title,
          }));
          setCompanyList(items);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoadingCompanies(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [companySearch, group]);

  const displayedCompanies = React.useMemo(() => {
    const list = [...companyList];
    const selected = effectiveFilterState.companies || [];
    selected.forEach((selectedTitle) => {
      if (!list.some(c => c.title === selectedTitle)) {
        list.push({ id: selectedTitle, title: selectedTitle });
      }
    });
    return list;
  }, [companyList, effectiveFilterState.companies]);

  const updateFilter = (updates: Partial<FilterState>) => {
    const newState = { ...effectiveFilterState, ...updates };
    // If a set function was transferred via props, use it. If not, use the setInternalFilterState function. This ensures code safety.
    if (onFilterChange) {
      onFilterChange(newState);
    } else {
      setInternalFilterState(newState);
    }
  };

  const handleCategoryClick = (opt: string) => {
    const newCategories = effectiveFilterState.categories.includes(opt)
      ? effectiveFilterState.categories.filter(c => c !== opt)
      : [...effectiveFilterState.categories, opt];
    updateFilter({ categories: newCategories });
  };

  const handleCompanyClick = (opt: string) => {
    const selected = effectiveFilterState.companies || [];
    const newCompanies = selected.includes(opt)
      ? selected.filter(c => c !== opt)
      : [...selected, opt];
    updateFilter({ companies: newCompanies });
  };

  const handleStatusClick = (opt: string) => {
    const newStatuses = effectiveFilterState.statuses.includes(opt)
      ? effectiveFilterState.statuses.filter(s => s !== opt)
      : [...effectiveFilterState.statuses, opt];
    updateFilter({ statuses: newStatuses });
  };

  const handleParticipantClick = (opt: string) => {
    updateFilter({ participantRange: opt });
  };

  const handlePriceRangeChange = (newPriceRange: [number, number]) => {
    updateFilter({ priceRange: newPriceRange });
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {/* קטגוריה */}
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography component="span">קטגוריה</Typography>
          <Typography
            component="span"
            sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
          >
            {effectiveFilterState.categories.length > 0 ? '(' + effectiveFilterState.categories.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(categoryList.length ? categoryList : ["..."]).map((opt) => {
            const isSelected = effectiveFilterState.categories.includes(opt);
            return (
              <OptionItem
                key={opt}
                onClick={() => handleCategoryClick(opt)}
                selected={isSelected}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "6px",
                  mb: 0.5,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(26, 42, 90, 0.04)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(26, 42, 90, 0.08)",
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "rgba(26, 42, 90, 0.12)",
                    }
                  }
                }}
              >
                <span>{opt}</span>
                {isSelected && <CheckIcon sx={{ fontSize: "0.95rem", color: "primary.main" }} />}
              </OptionItem>
            );
          })}
        </AccordionDetails>
      </Accordion>
      {/* חברה */}
      {group === "active" && (
        <>
          <Accordion>
            <AccordionSummary>
              <Typography component="span">חברה</Typography>
              <Typography
                component="span"
                sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
              >
                {effectiveFilterState.companies && effectiveFilterState.companies.length > 0
                  ? '(' + effectiveFilterState.companies.length + ')'
                  : "הכל"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                fullWidth
                placeholder="חפש חברה..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {loadingCompanies ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SearchIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                        )}
                      </InputAdornment>
                    ),
                  }
                }}
              />
              {displayedCompanies.map((opt) => {
                const isSelected = effectiveFilterState.companies.includes(opt.title);
                return (
                  <OptionItem
                    key={opt.id}
                    onClick={() => handleCompanyClick(opt.title)}
                    selected={isSelected}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "6px",
                      mb: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(26, 42, 90, 0.04)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(26, 42, 90, 0.08)",
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "rgba(26, 42, 90, 0.12)",
                        }
                      }
                    }}
                  >
                    <span>{opt.title}</span>
                    {isSelected && <CheckIcon sx={{ fontSize: "0.95rem", color: "primary.main" }} />}
                  </OptionItem>
                );
              })}
              {displayedCompanies.length === 0 && !loadingCompanies && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 1, fontSize: "0.8rem" }}>
                  לא נמצאו חברות
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
          <Divider />
        </>
      )}

      {/* סטטוס קבוצה */}
      {group === "active" && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Typography component="span">סטטוס קבוצה</Typography>
              <Typography
                component="span"
                sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
              >
                {effectiveFilterState.statuses.length > 0 ? '(' + effectiveFilterState.statuses.length + ')' : "הכל"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {statusOptions.map((opt) => {
                const isSelected = effectiveFilterState.statuses.includes(opt.value);
                return (
                  <OptionItem
                    key={opt.value}
                    onClick={() => handleStatusClick(opt.value)}
                    selected={isSelected}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "6px",
                      mb: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(26, 42, 90, 0.04)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(26, 42, 90, 0.08)",
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "rgba(26, 42, 90, 0.12)",
                        }
                      }
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckIcon sx={{ fontSize: "0.95rem", color: "primary.main" }} />}
                  </OptionItem>
                );
              })}
            </AccordionDetails>
          </Accordion>
          <Divider />
        </>
      )}

      {/* כמות משתתפים */}
      {group === "active" && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Typography component="span">כמות משתתפים</Typography>
              <Typography
                component="span"
                sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
              >
                {effectiveFilterState.participantRange ? participantOptions.find(o => o.value === effectiveFilterState.participantRange)?.label : "הכל"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {participantOptions.map((opt) => {
                const isSelected = effectiveFilterState.participantRange === opt.value;
                return (
                  <OptionItem
                    key={opt.value}
                    onClick={() => handleParticipantClick(opt.value)}
                    selected={isSelected}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "6px",
                      mb: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(26, 42, 90, 0.04)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(26, 42, 90, 0.08)",
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "rgba(26, 42, 90, 0.12)",
                        }
                      }
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckIcon sx={{ fontSize: "0.95rem", color: "primary.main" }} />}
                  </OptionItem>
                );
              })}
            </AccordionDetails>
          </Accordion>
          <Divider />
        </>
      )}

      {/* מחיר */}
      {group === "active" && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Typography component="span">מחיר</Typography>
              {effectiveFilterState.priceRange && (
                <Typography
                  component="span"
                  sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
                >
                  {effectiveFilterState.priceRange[0]}₪ - {effectiveFilterState.priceRange[1]}₪
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <PriceRangeFilter
                priceRange={effectiveFilterState.priceRange!}
                setPriceRange={handlePriceRangeChange}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};
