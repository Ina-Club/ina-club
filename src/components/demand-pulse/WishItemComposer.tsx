"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Collapse,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface WishItemComposerProps {
  onPosted: () => void;
}

export default function WishItemComposer({ onPosted }: WishItemComposerProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [price, setPrice] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  if (!isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: "12px 16px",
          borderRadius: "14px",
          border: "1.5px dashed rgba(0,0,0,0.15)",
          cursor: "pointer",
          background: "linear-gradient(-135deg, #ffffff, #f0f4ff)",
          "&:hover": { bgcolor: "rgba(66,100,212,0.07)" },
          transition: "background 0.2s",
        }}
        onClick={() => router.push("/sign-in")}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "rgba(66,100,212,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          ✦
        </Box>
        <Typography variant="body2" color="text.secondary">
          <Typography component="span" variant="body2" color="primary.main" fontWeight={600}>
            התחבר
          </Typography>{" "}
          כדי לפרסם מה אתה מחפש
        </Typography>
      </Box>
    );
  }

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wish-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          targetPrice: price ? parseFloat(price) : undefined,
          categoryId: categoryId || undefined,
        }),
      });
      if (res.ok) {
        setText("");
        setPrice("");
        setCategoryId("");
        setShowPrice(false);
        onPosted();
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: focused
          ? "1.5px solid rgba(66,100,212,0.5)"
          : "1.5px solid rgba(0,0,0,0.1)",
        bgcolor: "background.paper",
        boxShadow: focused ? "0 0 0 3px rgba(66,100,212,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
        p: "6px 8px 6px 12px",
      }}
    >
      <TextField
        inputRef={textRef}
        fullWidth
        multiline
        maxRows={3}
        placeholder="מה אתם רוצים לקנות? (לדוג׳: מחפש AirPods Pro באזור 120$)"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 200))}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => setShowPrice((p) => !p)}
                  sx={{
                    color: showPrice ? "primary.main" : "text.disabled",
                    "&:hover": { color: "primary.main" },
                    p: "4px",
                  }}
                  title="הוסף מחיר יעד"
                >
                  <AttachMoneyIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!text.trim() || loading}
                  onClick={handleSubmit}
                  sx={{
                    minWidth: 0,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    boxShadow: "none",
                  }}
                  endIcon={
                    loading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      <SendIcon sx={{ fontSize: "14px !important" }} />
                    )
                  }
                >
                  שלח
                </Button>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" } }}
      />

      <Collapse in={showPrice}>
        <Box sx={{ display: "flex", gap: 2, mt: 1, pt: 1, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <TextField
            fullWidth
            type="number"
            placeholder="מחיר יעד (בחר מחיר הגיוני שהבקשה תהיה ריאלית...)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            variant="standard"
            size="small"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiInputBase-input": { fontSize: "0.85rem" },
            }}
          />
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <Select
              displayEmpty
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disableUnderline
              sx={{ fontSize: "0.85rem", color: categoryId ? "text.primary" : "text.disabled" }}
            >
              <MenuItem value="" disabled>
                <em>קטגוריה (אופציונלי)</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
}
