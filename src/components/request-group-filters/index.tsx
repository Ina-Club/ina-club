import {
  Box,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface RequestGroupFiltersProps { }

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({ }) => {
  return (
    <Box
      component="section"
      sx={{
        maxWidth: 1280,
        mx: "auto",
        position: "relative",
        borderColor: "#e5e7eb",
        overflow: "hidden",
        boxShadow: 3,
        borderRadius: 1,
        py: { xs: 2, md: 2 },
        px: { xs: 2, md: 2 },
      }}
    >
      {/* Search bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#e5e7eb",
          borderRadius: 1,
          borderColor: "grey.500",
          py: 1,
        }}
      >
        <SearchIcon sx={{ color: "action.active", mr: 1 }} />
        <InputBase
          placeholder="חפש בקשות..."
          inputProps={{ "aria-label": "search" }}
          sx={{ flex: 1, px: 1 }}
        />
      </Box>
    </Box>
  );
};
