"use client";

import { useState } from "react";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

type PageHintButtonProps = {
  bullets: string[];
};

export function PageHintButton({ bullets }: PageHintButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label="מה עושים בדף זה"
        aria-expanded={open}
        aria-haspopup="true"
        sx={{
          color: "primary.main",
          opacity: 0.75,
          bgcolor: "rgba(26, 42, 90, 0.06)",
          border: "1px solid rgba(26, 42, 90, 0.1)",
          "&:hover": {
            opacity: 1,
            bgcolor: "rgba(26, 42, 90, 0.1)",
          },
        }}
      >
        <HelpOutlineRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              borderRadius: 2,
              p: 2,
              maxWidth: 320,
              mt: 1,
              border: "1px solid rgba(26, 42, 90, 0.1)",
              boxShadow: "0 12px 40px rgba(26, 42, 90, 0.12)",
            },
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1.25, fontWeight: 700, color: "primary.main" }}
        >
          מה עושים כאן
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
          {bullets.map((line) => (
            <Typography
              key={line}
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.85, lineHeight: 1.55, "&:last-child": { mb: 0 } }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      </Popover>
    </>
  );
}
