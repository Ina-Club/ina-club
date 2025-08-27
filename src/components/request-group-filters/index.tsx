"use client";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Filters } from "@/components/request-group-filters/filters";
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
          width: 400,
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 2,
          py: { xs: 2, md: 3 },
          px: { xs: 5, md: 2 },
          flexDirection: { xs: "row-reverse", md: "column" },
        }}
      >
        {/* 🎛️ עמודת פילטרים */}
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
          <Box>
            <Typography variant="h6" component="span">מסננים</Typography>
            <Filters />
          </Box>
        )}
      </Box>
    </>
  );
};
