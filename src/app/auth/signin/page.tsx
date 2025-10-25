"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Stack, Alert, CircularProgress, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'login_required') {
      setInfoMessage('עליך להתחבר כדי ליצור בקשה חדשה. אם אין לך חשבון, תוכל ליצור אחד למטה');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't redirect immediately
        callbackUrl: "/"
      });

      if (res?.ok) {
        setStatus("success");
        // Wait a moment for session to be established
        setTimeout(async () => {
          const session = await getSession();
          if (session) {
            router.push("/");
          } else {
            // If session still not available, try again
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        }, 500);
      } else {
        setStatus("error");
        setError(res?.error || "אימייל או סיסמה אינם נכונים");
      }
    } catch (err) {
      setStatus("error");
      setError("אירעה שגיאה בהתחברות. אנא נסה שוב.");
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

      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          התחברות בהצלחה! מעביר אותך...
        </Alert>
      )}

      {infoMessage && (
        <Alert severity="info" sx={{ mt: 2 }}>{infoMessage}</Alert>
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
