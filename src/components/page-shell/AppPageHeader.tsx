"use client";

import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/site-breadcrumbs";
import { PageHintButton } from "@/components/page-shell/PageHintButton";

export type AppPageHeaderProps = {
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Subtle help icon → popover (critical pages only) */
  hintBullets?: string[];
  heroSx?: object;
};

export function AppPageHeader({
  title,
  description,
  breadcrumbs,
  hintBullets,
  heroSx,
}: AppPageHeaderProps) {
  const showHint = hintBullets && hintBullets.length > 0;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #ffffff 0%, #e8eef6 42%, #dce6f2 100%)",
        pt: { xs: 2.5, md: 3.5 },
        pb: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
        borderBottom: "1px solid",
        borderColor: "rgba(26, 42, 90, 0.08)",
        ...heroSx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            left: "8%",
            width: 280,
            height: 280,
            bgcolor: "secondary.main",
            borderRadius: "50%",
            filter: "blur(88px)",
            opacity: 0.25,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            right: "5%",
            width: 340,
            height: 340,
            bgcolor: "primary.main",
            borderRadius: "50%",
            filter: "blur(100px)",
            opacity: 0.12,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          maxWidth: 1280,
          mx: "auto",
          textAlign: "right",
        }}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator="›"
            sx={{
              mb: 1.5,
              "& .MuiBreadcrumbs-separator": { color: "text.secondary", mx: 0.75 },
            }}
          >
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1;
              if (!c.href || isLast) {
                return (
                  <Typography
                    key={`${c.label}-${i}`}
                    color={isLast ? "text.primary" : "text.secondary"}
                    variant="body2"
                    sx={{ fontWeight: isLast ? 600 : 400 }}
                  >
                    {c.label}
                  </Typography>
                );
              }
              return (
                <MuiLink
                  key={c.href}
                  component={Link}
                  href={c.href}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {c.label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        )}

        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
          sx={{ mb: 1 }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { md: "2.35rem", xs: "1.65rem" },
                lineHeight: 1.2,
                color: "primary.main",
              }}
            >
              {title}
            </Typography>
          </Box>
          {showHint && <PageHintButton bullets={hintBullets!} />}
        </Stack>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 720,
            ml: "auto",
            lineHeight: 1.75,
            fontSize: { md: "1.05rem", xs: "0.95rem" },
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
