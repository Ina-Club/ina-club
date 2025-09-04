"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;
    if (!cloudName || !preset) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) setImageUrl(data.secure_url as string);
    } finally {
      setUploading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    if (password !== confirmPassword) {
      setStatus("idle");
      setError("הסיסמאות אינן תואמות");
      return;
    }
    try {
      // save pending
      const save = await fetch("/api/auth/signup-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, imageUrl }),
      });
      if (!save.ok) {
        const j = await save.json().catch(() => ({}));
        throw new Error(j.error || "שמירת פרטי הרשמה נכשלה");
      }
      const res = await signIn("email", { email, redirect: false, callbackUrl: "/" });
      if (res?.ok) setStatus("sent");
      else {
        setStatus("error");
        setError("Could not send magic link. Try again.");
      }
    } catch (err) {
      setStatus("error");
      setError((err as Error).message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        יצירת חשבון
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2} component="form" onSubmit={handleSignUp}>
        <TextField label="שם" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="אימייל" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <TextField label="אימות סיסמה" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />
        <Button component="label" variant="outlined" disabled={uploading}>
          {uploading ? "מעלה..." : imageUrl ? "החלפת תמונה" : "העלה תמונה"}
          <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={status === "loading"}
          startIcon={status === "loading" ? <CircularProgress size={18} /> : null}
        >
          {status === "loading" ? "שולחים קישור..." : "שליחת קישור אימות"}
        </Button>
      </Stack>

      {status === "sent" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          שלחנו לך קישור כניסה. בדוק/י את המייל שלך.
        </Alert>
      )}
    </Box>
  );
}
