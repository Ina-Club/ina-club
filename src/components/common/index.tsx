import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    min?: number;
    max?: number;
  }
  
  export const NumericFormatPrice = React.forwardRef<
    NumericFormatProps,
    CustomProps
  >(function NumericFormatPrice(props, ref) {
    const { onChange, min, max, ...other } = props;
  
    return (
      // @ts-ignore
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        suffix="₪"
        renderText={(formattedValue) => {
          const numeric = Number(formattedValue.replace(/[^\d]/g, ""));
  
          if (min !== undefined && numeric === min) {
            return `≤ ${min}₪`;
          }
          if (max !== undefined && numeric === max) {
            return `≥ ${max}₪`;
          }
  
          return formattedValue;
        }}
      />
    );
  });