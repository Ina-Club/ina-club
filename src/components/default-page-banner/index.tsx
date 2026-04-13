"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { PageHintButton } from "@/components/page-shell/PageHintButton";

export interface DefaultPageBannerProps {
  header: string;
  description: string;
  mainSx?: object;
  /** אייקון עזרה עדין → חלון קטן (דפים קריטיים) */
  hintBullets?: string[];
}

export const DefaultPageBanner: React.FC<DefaultPageBannerProps> = ({
  header,
  description,
  mainSx,
  hintBullets,
}) => {
  const showHint = hintBullets && hintBullets.length > 0;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(140deg,rgba(255, 255, 255, 1) 0%, rgba(211, 224, 235, 1) 100%)",
        pt: { xs: 2, md: 4 },
        px: { xs: 2, md: 4 },
        ...mainSx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 40,
            width: 288,
            height: 288,
            bgcolor: "#f0a868",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            right: 40,
            width: 384,
            height: 384,
            bgcolor: "#1a2a5a",
            borderRadius: "50%",
            filter: "blur(96px)",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          maxWidth: 1280,
          mx: "auto",
          textAlign: "left",
          direction: "ltr",
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          gap={1}
          sx={{ mb: 1 }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { md: "2.75rem", xs: "2rem" },
                lineHeight: 1.1,
                color: "#1a2a5a",
              }}
            >
              {header}
            </Typography>
          </Box>
          {showHint && <PageHintButton bullets={hintBullets!} />}
        </Stack>

        <Typography
          variant="h5"
          sx={{
            color: "#1a2a5a",
            mb: 6,
            fontSize: { md: "1.25rem", xs: "1rem" },
            fontWeight: 400,
            lineHeight: 1.6,
            opacity: 0.92,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
