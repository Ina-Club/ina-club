"use client";

import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";

interface CategoryFilterBarProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoryFilterBar({
  selectedCategories,
  onChange,
}: CategoryFilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const names = (data.categories ?? []).map((c: { name: string }) => c.name);
        setCategories(names);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCategoryToggle = (category: string) => {
    if (category === "") {
      onChange([]); // Clear filters (Select "All")
      return;
    }

    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: "flex", gap: 1, py: 2, overflowX: "auto" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Chip
            key={i}
            label="טוען..."
            variant="outlined"
            disabled
            sx={{ borderRadius: "20px", px: 1 }}
          />
        ))}
      </Box>
    );
  }

  const isAllActive = selectedCategories.length === 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <span>סינון לפי קטגוריות:</span>
        {selectedCategories.length > 0 && (
          <Typography
            component="span"
            variant="caption"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 1,
              py: 0.2,
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {selectedCategories.length}
          </Typography>
        )}
      </Typography>
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.25,
          overflowX: "auto",
          py: 0.5,
          px: 0.25,
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome/Safari
          },
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* "All" Pill */}
        <Chip
          label="הכל"
          onClick={() => handleCategoryToggle("")}
          sx={{
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: isAllActive ? 600 : 500,
            cursor: "pointer",
            px: 1.5,
            py: 2,
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            bgcolor: isAllActive ? "primary.main" : "rgba(26, 42, 90, 0.04)",
            color: isAllActive ? "white" : "text.secondary",
            border: "1px solid",
            borderColor: isAllActive ? "primary.main" : "transparent",
            "&:hover": {
              bgcolor: isAllActive ? "primary.dark" : "rgba(26, 42, 90, 0.08)",
              transform: "scale(1.03)",
            },
            boxShadow: isAllActive
              ? "0 4px 12px rgba(26, 42, 90, 0.2)"
              : "none",
          }}
        />

        {/* Category Pills */}
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryToggle(category)}
              sx={{
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: isSelected ? 600 : 500,
                cursor: "pointer",
                px: 1.5,
                py: 2,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: isSelected ? "primary.main" : "rgba(26, 42, 90, 0.04)",
                color: isSelected ? "white" : "text.secondary",
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: isSelected ? "primary.dark" : "rgba(26, 42, 90, 0.08)",
                  transform: "scale(1.03)",
                },
                boxShadow: isSelected
                  ? "0 4px 12px rgba(26, 42, 90, 0.2)"
                  : "none",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
