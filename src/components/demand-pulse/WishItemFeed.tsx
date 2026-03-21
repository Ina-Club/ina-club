"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import WishItemCard, { WishItemData } from "./WishItemCard";
import WishItemComposer from "./WishItemComposer";

export default function WishItemFeed() {
  const [items, setItems] = useState<WishItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/wish-items", { cache: "no-store" });
      if (res.ok) {
        const data: WishItemData[] = await res.json();
        setItems(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleLikeToggle = (id: string, liked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, likeCount: item.likeCount + (liked ? 1 : -1), isLikedByMe: liked }
          : item
      )
    );
  };

  return (
    <Box>
      {/* Composer */}
      <Box sx={{ mb: 2 }}>
        <WishItemComposer onPosted={fetchItems} />
      </Box>

      {/* Feed */}
      {loading ? (
        <Grid container spacing={1.5}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton
                variant="rounded"
                height={110}
                sx={{ borderRadius: "16px" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "1.5rem", mb: 0.5 }}>
            🛍️
          </Typography>
          <Typography variant="body2">
            היו הראשונים לפרסם מה אתם מחפשים
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1.5}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <WishItemCard item={item} onLikeToggle={handleLikeToggle} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
