import { Box, TextField, MenuItem, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriceRangeFilter from "./price-range-filter";

interface FiltersProps {}

export const Filters: React.FC<FiltersProps> = ({}) => {
  const minPrice = 20;
  const maxPrice = 80;
  const rtlTheme = createTheme({ direction: "rtl" });
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [popularity, setPopularity] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* קטגוריה */}
        <Box>
          <Typography>קטגוריה</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
                right: "7px",
              },
            }}
          >
            <MenuItem value="all">הכול</MenuItem>
            <MenuItem value="electronics">אלקטרוניקה</MenuItem>
            <MenuItem value="clothing">ביגוד</MenuItem>
            <MenuItem value="food">מזון</MenuItem>
          </TextField>
        </Box>

        {/* מיקום */}
        <Box>
          <Typography>מיקום</Typography>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
                right: "7px",
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
        <Box>
          <Typography>פופולריות</Typography>
          <TextField
            select
            variant="outlined"
            fullWidth
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
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
                right: "7px",
              },
            }}
          >
            <MenuItem value="all">הכול</MenuItem>
            <MenuItem value="popular">פופולרי</MenuItem>
            <MenuItem value="new">חדש</MenuItem>
          </TextField>
        </Box>

        {/* טווח מחיר */}
        <PriceRangeFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </Box>
    </>
  );
};
