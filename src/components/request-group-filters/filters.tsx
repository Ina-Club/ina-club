import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface FiltersProps { }

export const Filters: React.FC<FiltersProps> = ({ }) => {
  const minPrice = 20;
  const maxPrice = 80;
  const rtlTheme = createTheme({ direction: "rtl" });
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [popularity, setPopularity] = useState('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: minPrice, max: maxPrice });

  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange({ min: newValue[0], max: newValue[1] });
    }
  };

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
        </Box >

        {/* מיקום */}
        < Box>
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
        </Box >

        {/* פופולריות */}
        < Box>
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
                left: "7px",
                right: "auto",
              },
            }}
          >
            <MenuItem value="all">הכול</MenuItem>
            <MenuItem value="popular">פופולרי</MenuItem>
            <MenuItem value="new">חדש</MenuItem>
          </TextField>
        </Box >

        {/* טווח מחיר */}
        <ThemeProvider theme={rtlTheme}>
          <Box sx={{ width: 300, mx: "auto" }}>
            <Slider
              value={[priceRange.min, priceRange.max]}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              disableSwap
              min={minPrice}
              max={maxPrice}
              sx={{
                boxSizing: 'content-box',
                '& .MuiSlider-thumb': { width: 20, height: 20 }, // document the size you matched
              }}
            />
            <Typography>{priceRange.min}</Typography>
            <Typography>{priceRange.max}</Typography>
          </Box>
        </ThemeProvider>
      </Box>
    </>
  );
};