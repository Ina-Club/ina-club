// components/ThemeRegistry/ThemeRegistry.tsx

"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
// @ts-ignore
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import NextAppDirEmotionCacheProvider from "./emotion-cache";
import theme from "./theme";

// Define emotionCacheOptions at the module level to ensure it's only created once
const emotionCacheOptions = {
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentTheme = theme();

  return (
    <NextAppDirEmotionCacheProvider options={emotionCacheOptions}>
      <ThemeProvider theme={currentTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
