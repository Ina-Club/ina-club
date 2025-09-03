"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.ok) router.push("/");
    else alert("Invalid credentials");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" mb={3}>Sign In</Typography>

      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained" color="primary" fullWidth>Sign In</Button>
      </Stack>

      <Typography variant="body2" align="center" my={2}>OR</Typography>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}
