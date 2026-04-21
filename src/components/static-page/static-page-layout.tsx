"use client";

import React, { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { DefaultPageBanner } from "@/components/default-page-banner";

export type StaticPageSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  customContent?: ReactNode;
};

interface StaticPageLayoutProps {
  header: string;
  description: string;
  sections: StaticPageSection[];
}

export function StaticPageLayout({ header, description, sections }: StaticPageLayoutProps) {
  return (
    <>
      <DefaultPageBanner header={header} description={description} />

      <Box
        component="section"
        sx={{
          maxWidth: 1080,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
        }}
      >
        {sections.map((section) => (
          <Paper
            key={section.title}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              border: "1px solid #e0e7f1",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: "#1a2a5a",
              }}
            >
              {section.title}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, color: "#1a2a5a" }}>
              {section.customContent}

              {section.paragraphs?.map((text) => (
                <Typography key={text} sx={{ lineHeight: 1.7 }}>
                  {text}
                </Typography>
              ))}

              {section.bullets && (
                <Box component="ul" sx={{ m: 0, pl: 3, display: "grid", gap: 0.75 }}>
                  {section.bullets.map((item) => (
                    <Typography key={item} component="li" sx={{ lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
}

