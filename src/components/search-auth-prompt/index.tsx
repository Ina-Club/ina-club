"use client";

import { Box, Button, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/navigation";

interface SearchAuthPromptProps {
  text: string;
  redirectTo: string;
}

export function SearchAuthPrompt({ text, redirectTo }: SearchAuthPromptProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
        p: 2,
        borderRadius: "14px",
        border: "1.5px dashed rgba(26,42,90,0.18)",
        bgcolor: "rgba(66,100,212,0.04)",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        <Typography component="span" variant="body2" color="primary.main" fontWeight={700}>
          התחברו
        </Typography>{" "}
        {text}
      </Typography>
      <Button
        variant="contained"
        startIcon={<LoginIcon />}
        onClick={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`)}
        sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
      >
        התחברות להמשך
      </Button>
    </Box>
  );
}
