"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Stack, TextField, Button, Typography, Alert, CircularProgress, Avatar } from "@mui/material";

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.name) setName(session.user.name);
      // If user already has a password, skip
      // API will guard too, but client redirect improves UX.
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;
    if (!cloudName || !preset) {
      setError("חסר קונפיגורציית העלאה לשרת התמונות");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url as string);
      } else {
        setError("העלאת התמונה נכשלה");
      }
    } catch (e) {
      setError("שגיאה בהעלאת התמונה");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, imageUrl }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "שמירת הפרופיל נכשלה");
      }
      // Now sign in with the new password and redirect to home
      const email = session?.user?.email as string;
      if (email) {
        await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
      } else {
        router.replace("/");
      }
    } catch (e: any) {
      setError(e.message || "אירעה שגיאה");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return null;

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 8, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" mb={3} textAlign="center">השלמת פרופיל</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2} component="form" onSubmit={handleSave}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={imageUrl || session?.user?.image || undefined} sx={{ width: 64, height: 64 }} />
          <Button component="label" variant="outlined" disabled={uploading}>
            {uploading ? "מעלה..." : "העלה תמונה"}
            <input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </Button>
        </Box>

        <TextField label="שם" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
        <TextField label="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <TextField label="אימות סיסמה" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />

        <Button type="submit" variant="contained" color="primary" disabled={saving} fullWidth>
          {saving ? <CircularProgress size={20} color="inherit" /> : "שמירה והמשך"}
        </Button>
      </Stack>
    </Box>
  );
}


