"use client";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Filters } from "@/components/request-group-filters/filters";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

interface RequestGroupFiltersProps {}

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs–sm breakpoint
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <Box
        component="section"
        sx={{
          maxWidth: 1280,
          mx: "auto",
          position: "relative",
          mt: { xs: -6, md: -10 }, // 🟢 מרים את הפילטרים חצי על הגרדיאנט
          zIndex: 10,
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 2,
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          direction: "rtl",
        }}
      >
        {/* 🎛️ שורת פילטרים */}
        {isMobile ? (
          <>
            <IconButton onClick={() => setOpen(true)}>
              <FilterListIcon />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
              <DialogTitle>מסננים</DialogTitle>
              <DialogContent>
                <Filters />
              </DialogContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setOpen(false)}>סגור</Button>
              </Box>
            </Dialog>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Filters />
          </Box>
        )}

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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={searchText === "" ? "חפש בקשות..." : ""}
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
