import {
  Box,
  MenuItem,
  Slider,
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

interface FiltersProps { }

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
  // ensure override wins
  "&&.Mui-selected": {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  "&&.Mui-selected.Mui-focusVisible": {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
}));

export function toggleVariable<T>(
  setVariable: React.Dispatch<React.SetStateAction<T[]>>,
  value: T
) {
  setVariable(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
}

export const Filters: React.FC<FiltersProps> = () => {
  const [category, setCategory] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [popularity, setPopularity] = useState<string[]>([]);
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
            {category.length > 0 ? '(' + category.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {["אלקטרוניקה", "ביגוד", "מזון"].map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setCategory, opt)}
              selected={category.includes(opt)}
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
            {location.length > 0 ? '(' + location.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {["צפון", "מרכז", "דרום"].map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setLocation, opt)}
              selected={location.includes(opt)}
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
            {popularity.length > 0 ? '(' + popularity.length + ')' : "הכל"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {["פופולרי", "חדש"].map((opt) => (
            <OptionItem
              key={opt}
              onClick={() => toggleVariable(setPopularity, opt)}
              selected={popularity.includes(opt)}
            >
              {opt}
            </OptionItem>
          ))}
        </AccordionDetails>
      </Accordion>
      <Divider />

      {/* מחיר */}
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
    </Box>
  );
};
