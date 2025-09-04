import {
  Box,
  MenuItem,
  Typography,
  styled,
  Divider,
} from "@mui/material";
import * as React from "react";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useState } from "react";
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

export function toggleVariable<T>(
  setVariable: React.Dispatch<React.SetStateAction<T[]>>,
  value: T
) {
  setVariable(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
}

export interface FilterState {
  categories: string[];
  locations: string[];
  popularities: string[];
  priceRange: [number, number]; // Required in active-groups only
}

interface FiltersProps {
  group: GroupType // There is no default
  filterState?: FilterState;
  onFilterChange?: (filterState: FilterState) => void;
}

export const Filters: React.FC<FiltersProps> = ({ group, filterState, onFilterChange }) => {
  const categoryList: string[] = ["אלקטרוניקה", "ביגוד", "מזון"];
  const locationList: string[] = ["צפון", "מרכז", "דרום"];
  const popularityList: string[] = ["פופולרי", "חדש"];
  
  const [internalFilterState, setInternalFilterState] = useState<FilterState>({
    categories: [],
    locations: [],
    popularities: [],
    priceRange: [0, 10_000]
  });

  const effectiveFilterState = filterState ?? internalFilterState;

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

  const handleLocationClick = (opt: string) => {
    const newLocations = effectiveFilterState.locations.includes(opt)
      ? effectiveFilterState.locations.filter(l => l !== opt)
      : [...effectiveFilterState.locations, opt];
    updateFilter({ locations: newLocations });
  };

  const handlePopularityClick = (opt: string) => {
    const newPopularities = effectiveFilterState.popularities.includes(opt)
      ? effectiveFilterState.popularities.filter(p => p !== opt)
      : [...effectiveFilterState.popularities, opt];
    updateFilter({ popularities: newPopularities });
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
          {categoryList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => handleCategoryClick(opt)}
              selected={effectiveFilterState.categories.includes(opt)}
            >
              {opt}
            </OptionItem>
          ))}
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* מיקום */}
      <Accordion>
        <AccordionSummary>
          <Typography component="span">מיקום</Typography>
          <Typography
            component="span"
            sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
          >
            {effectiveFilterState.locations.length > 0 ? '(' + effectiveFilterState.locations.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {locationList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => handleLocationClick(opt)}
              selected={effectiveFilterState.locations.includes(opt)}
            >
              {opt}
            </OptionItem>
          ))}
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* פופולריות */}
      <Accordion>
        <AccordionSummary>
          <Typography component="span">פופולריות</Typography>
          <Typography
            component="span"
            sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
          >
            {effectiveFilterState.popularities.length > 0 ? '(' + effectiveFilterState.popularities.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {popularityList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => handlePopularityClick(opt)}
              selected={effectiveFilterState.popularities.includes(opt)}
            >
              {opt}
            </OptionItem>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* מחיר */}
      {group === "active" && (
        <>
          <Divider />
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
                priceRange={effectiveFilterState.priceRange}
                setPriceRange={handlePriceRangeChange}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};
