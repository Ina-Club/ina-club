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

interface FiltersProps {
  group: GroupType // There is no default
}

export const Filters: React.FC<FiltersProps> = ({ group }) => {
  const categoryList: string[] = ["אלקטרוניקה", "ביגוד", "מזון"];
  const locationList: string[] = ["צפון", "מרכז", "דרום"];
  const popularityList: string[] = ["פופולרי", "חדש"];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPopularities, setSelectedPopularities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000]);

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
            {selectedCategories.length > 0 ? '(' + selectedCategories.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {categoryList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setSelectedCategories, opt)}
              selected={selectedCategories.includes(opt)}
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
            {selectedLocations.length > 0 ? '(' + selectedLocations.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {locationList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setSelectedLocations, opt)}
              selected={selectedLocations.includes(opt)}
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
            {selectedPopularities.length > 0 ? '(' + selectedPopularities.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {popularityList.map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setSelectedPopularities, opt)}
              selected={selectedPopularities.includes(opt)}
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
              {priceRange && (
                <Typography
                  component="span"
                  sx={{ color: "text.secondary", ml: 1, fontSize: "12px" }}
                >
                  {priceRange[0]}₪ - {priceRange[1]}₪
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <PriceRangeFilter
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};
