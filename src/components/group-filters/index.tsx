"use client";
import {
  Box, Button, Badge, IconButton, Drawer,
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

  const activeFilterCount = useMemo(() => {
    return Object.keys(filterState).reduce((count, key) => {
      if (key === "searchText") return count;
      if (key === "priceRange") {
        const range = filterState.priceRange;
        return count + (range && (range[0] !== 0 || range[1] !== 10_000) ? 1 : 0);
      }
      const value = filterState[key as keyof typeof filterState];
      if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
      return count + (!!value ? 1 : 0);
    }, 0);
  }, [filterState]);

  useEffect(() => {
    if (!activeFilterCount) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [activeFilterCount]);

  if (mode === "trigger") {
    // Mobile trigger → bottom-sheet Drawer
    return (
      <>
        <Badge badgeContent={activeFilterCount} color="primary" overlap="circular">
          <IconButton aria-label="open filters" onClick={() => setOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Badge>

        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          keepMounted
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "85dvh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {/* Handle bar */}
          <Box
            sx={{
              mx: "auto",
              mt: 1.5,
              mb: 0.5,
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: "grey.300",
              flexShrink: 0,
            }}
          />

          {/* Header row */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "grey.100",
              flexShrink: 0,
            }}
          >
            <Box
              component="span"
              sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a2a5a" }}
            >
              סינון
              {activeFilterCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "primary.main",
                  }}
                >
                  ({activeFilterCount} פעיל)
                </Box>
              )}
            </Box>
            <Button
              size="small"
              onClick={() => setOpen(false)}
              sx={{ fontWeight: 600, color: "#1a2a5a" }}
            >
              סגור
            </Button>
          </Box>

          {/* Scrollable filter content */}
          <Box sx={{ overflowY: "auto", flex: 1, pb: 3 }}>
            <Filters group={group} filterState={filterState} onFilterChange={onFilterChange} />
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop sidebar — just render the Filters, the card wrapper is handled in the page
  return <Filters group={group} filterState={filterState} onFilterChange={onFilterChange} />;
};
