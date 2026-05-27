"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { ReportTargetType } from "@/lib/types/report";

const REPORT_REASONS = [
  { value: "SPAM", label: "ספאם" },
  { value: "INAPPROPRIATE", label: "תוכן לא הולם" },
  { value: "DUPLICATE", label: "בקשה כפולה" },
  { value: "MISLEADING", label: "תוכן מטעה" },
  { value: "OTHER", label: "אחר" },
] as const;

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const MAX_DESCRIPTION = 500;

export default function ReportDialog({
  open,
  onClose,
  targetType,
  targetId,
}: ReportDialogProps) {
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setReason("");
    setDescription("");
    setStatus("idle");
    setErrorMessage("");
  };

  const handleClose = () => {
    if (status === "loading") return; // prevent closing while submitting
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description: description.trim() || undefined,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else if (res.status === 401) {
        router.push("/sign-in");
        return;
      } else {
        const data = await res.json().catch(() => null);
        const msg =
          res.status === 409
            ? "כבר דיווחת על תוכן זה."
            : res.status === 429
              ? "הגעת למגבלת הדיווחים היומית."
              : res.status === 403
                ? "לא ניתן לדווח על תוכן שלך."
                : data?.error ?? "משהו השתבש, נסה שוב.";
        setErrorMessage(msg);
        setStatus("error");
      }
    } catch {
      setErrorMessage("שגיאת רשת, נסה שוב.");
      setStatus("error");
    }
  };

  // ── Success view ────────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <ThumbUpOffAltIcon sx={{ fontSize: "2.5rem", mb: 1, color: "#2e7d32" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            הדיווח נשלח
          </Typography>
          <Typography variant="body2" color="text.secondary">
            תודה שעזרת לנו לשמור על הקהילה! נבדוק את הדיווח בהקדם.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ borderRadius: "10px", px: 4 }}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ── Form view ───────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", p: 1 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          pb: 0.5,
        }}
      >
        דיווח על תוכן
        <IconButton size="small" onClick={handleClose} disabled={status === "loading"}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          בחר/י את הסיבה לדיווח. הצוות שלנו יבדוק את הבקשה בהקדם.
        </Typography>

        {/* Reason selector */}
        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          {REPORT_REASONS.map((r) => (
            <FormControlLabel
              key={r.value}
              value={r.value}
              control={<Radio size="small" />}
              label={r.label}
              sx={{
                mx: 0,
                mb: 0.25,
                borderRadius: "10px",
                px: 1,
                transition: "background 0.15s",
                "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
                ...(reason === r.value && {
                  bgcolor: "rgba(26, 42, 90, 0.06)",
                }),
              }}
            />
          ))}
        </RadioGroup>

        {/* Description */}
        <Box sx={{ mt: 2 }}>
          <TextField
            label="פרטים נוספים"
            placeholder="ספר/י לנו עוד..."
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION) {
                setDescription(e.target.value);
              }
            }}
            helperText={`${description.length}/${MAX_DESCRIPTION}`}
            required={reason === "OTHER"}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />
        </Box>

        {/* Error alert */}
        {status === "error" && errorMessage && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={status === "loading"}
          sx={{ borderRadius: "10px" }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !reason ||
            status === "loading" ||
            (reason === "OTHER" && !description.trim())
          }
          sx={{
            borderRadius: "10px",
            px: 3,
            minWidth: 100,
            bgcolor: "#d32f2f",
            "&:hover": { bgcolor: "#b71c1c" },
          }}
          startIcon={
            status === "loading" ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {status === "loading" ? "שולח..." : "שלח דיווח"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
