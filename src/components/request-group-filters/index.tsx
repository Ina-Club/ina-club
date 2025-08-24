"use client";
import {
  Box,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Filters } from "@/components/request-group-filters/filters"
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

interface RequestGroupFiltersProps { }

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({ }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs–sm breakpoint
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          maxWidth: 1280,
          mx: "auto",
          position: "relative",
          borderColor: "#e5e7eb",
          overflow: "hidden",
          boxShadow: 3,
          borderRadius: 1,
          py: { xs: 2, md: 2 },
          px: { xs: 2, md: 2 },
          flexDirection: { xs: "row-reverse", md: "column" },
          gap: 2,
        }}
      >
        {/* 🎛️ שורת פילטרים */}
        < Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Filters />
        </Box>

        {/* 🔍 שדה חיפוש */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            borderColor: "grey.500",
            py: 1,
            px: 1,
          }}
        >
          <SearchIcon sx={{ color: "action.active", ml: 1 }} />
          <InputBase
            placeholder="חפש בקשות..."
            inputProps={{ "aria-label": "search" }}
            sx={{
              flex: 1,
              px: 1,
              textAlign: "right",
            }}
          />
        </Box>
      </Box>
    </>
  );
};
