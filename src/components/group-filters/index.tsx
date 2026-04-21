"use client";
import {
  Box, Button, IconButton, Typography, Dialog, DialogTitle, DialogContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect, useMemo } from "react";
import { Filters, FilterState } from "@/components/group-filters/filters";

type Mode = "sidebar" | "trigger";
export type GroupType = "request" | "active";

interface GroupFiltersProps {
  mode?: Mode; // default: "sidebar"
  group: GroupType
  filterState: FilterState;
  onFilterChange?: (filterState: FilterState) => void;
}

export const GroupFilters: React.FC<GroupFiltersProps> = ({ mode = "sidebar", group, filterState, onFilterChange }) => {
  const [open, setOpen] = useState(false);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filterState).some((key) => {
      if (key === 'priceRange') {
        const range = filterState.priceRange;
        return range && (range[0] !== 0 || range[1] !== 10_000);
      }
      const value = filterState[key as keyof typeof filterState];
      if (Array.isArray(value)) return value.length > 0;
      return !!value;
    });
  }, [filterState]);

  useEffect(() => {
    if (!hasActiveFilters) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasActiveFilters]);

  if (mode === "trigger") {
    // Mobile trigger (icon + dialog)
    return (
      <>
        <IconButton aria-label="open filters" onClick={() => setOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth keepMounted>
          <DialogTitle>מסננים</DialogTitle>
          <DialogContent>
            <Filters group={group} filterState={filterState} onFilterChange={onFilterChange} />
          </DialogContent>
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setOpen(false)}>סגור</Button>
          </Box>
        </Dialog>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        width: 275,
        bgcolor: "white",
        boxShadow: 3,
        borderRadius: 2,
        py: { xs: 2, md: 3 },
        px: { xs: 5, md: 2 },
        flexDirection: { xs: "row-reverse", md: "column" },
      }}
    >
      <Box>
        <Typography variant="h6" component="span">מסננים</Typography>
        <Filters group={group} filterState={filterState} onFilterChange={onFilterChange} />
      </Box>
    </Box>
  );
};
