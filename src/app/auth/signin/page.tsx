"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Box, Button, TextField, Typography, Stack, Alert, CircularProgress, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if (!res?.ok) {
      setStatus("error");
      setError("אימייל או סיסמה אינם נכונים");
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" mb={3}>התחברות</Typography>

      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <TextField label="אימייל" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
        <TextField label="סיסמה" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained" color="primary" disabled={status === "loading"} fullWidth>
          {status === "loading" ? <CircularProgress size={20} color="inherit" /> : "התחבר"}
        </Button>
      </Stack>

      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      )}

      <Typography variant="body2" align="center" my={2}>או</Typography>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        המשך עם Google
      </Button>

      <Typography variant="body2" align="center" mt={2}>
        חדש/ה כאן? {" "}
        <MuiLink component={NextLink} href="/auth/signup">ליצירת חשבון באמצעות אימייל</MuiLink>
      </Typography>
    </Box>
  );
}
