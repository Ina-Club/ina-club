import {
  Box,
  InputBase,
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface RequestGroupFiltersProps {}

export const RequestGroupFilters: React.FC<RequestGroupFiltersProps> = ({}) => {
  return (
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {/* קטגוריה */}
        <Box sx={{ width: "100%" }}>
          <Typography>קטגוריה</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "0 10px",
              },
              "& .MuiSelect-icon": {
                left: "7px",
                right: "auto",
              },
            }}
          >
            <MenuItem value="all">הכול</MenuItem>
            <MenuItem value="electronics">אלקטרוניקה</MenuItem>
            <MenuItem value="clothing">ביגוד</MenuItem>
            <MenuItem value="food">מזון</MenuItem>
          </TextField>
        </Box>
        {/* מחיר */}
        <Box sx={{ width: "100%" }}>
          <Typography>מחיר</Typography>
          <TextField
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "0 10px",
                textAlign: "right",
              },
              "& .MuiSelect-icon": {
                left: "7px",
                right: "auto",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">₪</InputAdornment>
                ),
              },
            }}
          ></TextField>
        </Box>

        {/* מיקום */}
        <Box sx={{ width: "100%" }}>
          <Typography>מיקום</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "0 10px",
              },
              "& .MuiSelect-icon": {
                left: "7px",
                right: "auto",
              },
            }}
          >
            <MenuItem value="all">כל המקומות</MenuItem>
            <MenuItem value="north">צפון</MenuItem>
            <MenuItem value="center">מרכז</MenuItem>
            <MenuItem value="south">דרום</MenuItem>
          </TextField>
        </Box>

        {/* פופולריות */}
        <Box sx={{ width: "100%" }}>
          <Typography>פופולריות</Typography>
          <TextField
            select
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#BED6E9",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "18px",
                padding: "0 10px",
              },
              "& .MuiSelect-icon": {
                left: "7px",
                right: "auto",
              },
            }}
          >
            <MenuItem value="all">הכול</MenuItem>
            <MenuItem value="popular">פופולרי</MenuItem>
            <MenuItem value="new">חדש</MenuItem>
          </TextField>
        </Box>
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
  );
};
