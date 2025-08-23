import {
  Box,
  InputBase,
  TextField,
  MenuItem,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface RequestGroupFiltersProps { }

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({ }) => {
  return (
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
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* 🎛️ Filters row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <TextField
          select
          label="קטגוריה"
          variant="standard"
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="all">הכל</MenuItem>
          <MenuItem value="electronics">אלקטרוניקה</MenuItem>
          <MenuItem value="clothing">ביגוד</MenuItem>
          <MenuItem value="food">מזון</MenuItem>
        </TextField>

        <TextField
          label="מחיר"
          variant="standard"
          sx={{ flex: 1, direction: "rtl" }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="end">₪</InputAdornment>,
            },
          }}
        >
        </TextField>

        <TextField
          select
          label="מיקום"
          variant="standard"
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="all">כל המקומות</MenuItem>
          <MenuItem value="north">צפון</MenuItem>
          <MenuItem value="center">מרכז</MenuItem>
          <MenuItem value="south">דרום</MenuItem>
        </TextField>

        <TextField
          select
          label="פופולריות"
          variant="standard"
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="all">הכל</MenuItem>
          <MenuItem value="popular">פופולרי</MenuItem>
          <MenuItem value="new">חדש</MenuItem>
        </TextField>
      </Box>

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
