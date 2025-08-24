import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
} from "@mui/material";

interface FiltersProps { }

export const Filters: React.FC<FiltersProps> = ({ }) => {
  return (
    <>
      {/* קטגוריה */}
      < Box sx={{ width: "100%" }}>
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
      </Box >
      {/* מחיר */}
      < Box sx={{ width: "100%" }}>
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
      </Box >

      {/* מיקום */}
      < Box sx={{ width: "100%" }}>
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
      </Box >

      {/* פופולריות */}
      < Box sx={{ width: "100%" }}>
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
      </Box >
    </>
  );
};