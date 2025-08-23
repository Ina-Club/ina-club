import {
  Box,
  Button,
  Typography,
} from "@mui/material";

interface RequestGroupFiltersProps { }

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({ }) => {
  return (
    <Box
      component="section"
      sx={{
        maxWidth: 1280,
        mx: "auto",
        position: "relative",
        color: "white",
        borderColor: "#e5e7eb",
        overflow: "hidden",
        boxShadow: 3,
        borderRadius: 1,
        background:
          "rgba(255, 255, 255, 0.96)",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
      }}
    >
    </Box>
  );
};
