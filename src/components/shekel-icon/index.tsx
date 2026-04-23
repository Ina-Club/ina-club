import { SvgIcon } from '@mui/material';

export default function ShekelIcon(props) {

  return (
    <SvgIcon {...props}>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
      >
        ₪
      </text>
    </SvgIcon>
  );
}