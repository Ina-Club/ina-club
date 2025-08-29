"use client";
import {
  Box, Button, IconButton, Typography, Dialog, DialogTitle, DialogContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import { Filters } from "@/components/request-group-filters/filters";

type Mode = "sidebar" | "trigger";

interface RequestGroupFiltersProps {
  mode?: Mode; // default: "sidebar"
}

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({ mode = "sidebar" }) => {
  const [open, setOpen] = useState(false);

  if (mode === "trigger") {
    // Mobile trigger (icon + dialog)
    return (
      <>
        <IconButton aria-label="open filters" onClick={() => setOpen(true)}>
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
    );
  }

  // Desktop sidebar
  return (
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
      <Box>
        <Typography variant="h6" component="span">מסננים</Typography>
        <Filters />
      </Box>
    </Box>
  );
};
