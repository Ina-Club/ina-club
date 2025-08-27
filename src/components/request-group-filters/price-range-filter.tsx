import { Box, Slider, TextField, styled } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { NumericFormatPrice } from "../common";

const PriceRangeFilter: React.FC<{
  priceRange: number[];
  setPriceRange: any;
  noSlider?: boolean;
}> = ({ priceRange, setPriceRange, noSlider }) => {
  return (
    <Formik
      initialValues={{ minPrice: priceRange[0], maxPrice: priceRange[1] }}
      validate={(values) => {
        // Treat empty as defaults (no limit)
        const rawMin = values.minPrice as any;
        const rawMax = values.maxPrice as any;

        let nextMin = rawMin === "" || rawMin == null ? 100 : Number(rawMin);
        let nextMax = rawMax === "" || rawMax == null ? 10_000 : Number(rawMax);

        if (nextMin < 100) {
          nextMin = 100;
        }
        if (nextMax > 10_000) {
          nextMax = 10_000;
        }
        if (nextMin > 10_000) {
          nextMin = 10_000;
        }
        if (nextMax < 100) {
          nextMax = 100;
        }
        if (nextMin > nextMax) {
          nextMax = nextMin;
        }
        if (nextMax < nextMin) {
          nextMin = nextMax;
        }

        setPriceRange([nextMin, nextMax]);
      }}
      onSubmit={(values, formikHelpers) => {
        // Handle form submission logic here
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          {!noSlider && (
            <PriceRangeSlider
              value={priceRange}
              onChange={(e, newValue: any) => {
                setPriceRange(newValue as number[]);
                setFieldValue("minPrice", (newValue as number[])[0]);
                setFieldValue("maxPrice", (newValue as number[])[1]);
              }}
              min={100}
              max={10_000}
              step={50}
            />
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Field
              as={CircleOutlinedInput}
              name="minPrice"
              label="מינימום"
              value={values.minPrice}
              onChange={handleChange}
              InputProps={{
                inputComponent: NumericFormatPrice as any,
                inputProps: {
                  min: 100,
                  max: 10000,
                },
              }}
              fullWidth
            />
            <Field
              as={CircleOutlinedInput}
              name="maxPrice"
              label="מקסימום"
              value={values.maxPrice}
              onChange={handleChange}
              InputProps={{
                inputComponent: NumericFormatPrice as any,
                inputProps: {
                  min: 100,
                  max: 10000,
                },
              }}
              fullWidth
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export const PriceRangeSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  // make thumb be white inside and have 3px thick blue border
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "3px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "& input": {
      "--webkit-appearance": "slider-vertical",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
  },
}));

export const CircleOutlinedInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    [theme.breakpoints.down("sm")]: {
      padding: "3.5px 14px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "7.5px 5px 7.5px 14px",
      maxWidth: "100px",
    },
  },
  [theme.breakpoints.up("md")]: {
    marginTop: "8px",
    marginBottom: "4px",
  },
}));

export default PriceRangeFilter;
