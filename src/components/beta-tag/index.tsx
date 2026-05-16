"use client";

import { useState } from "react";
import { Chip, Popover, Typography } from "@mui/material";

interface BetaTagProps {
  content: string;
  label?: string;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

export const BetaTag = ({ content, label = "BETA", size = "medium", variant = "outlined" }: BetaTagProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <Chip
        label={label}
        size={size}
        variant={variant}
        onClick={handleClick}
        sx={{
          fontWeight: 800,
          borderColor: "secondary.main",
          color: "secondary.main",
          mt: 0.5,
          cursor: "pointer",
        }}
      />
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              p: 2,
              maxWidth: 310,
              mt: 1,
              border: "1px solid rgba(26, 42, 90, 0.1)",
              boxShadow: "0 12px 40px rgba(26, 42, 90, 0.12)",
            },
          },
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {content}
        </Typography>
      </Popover>
    </>
  );
};
