"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundUploadStarted = useRef(false);

  const setRandomAvatar = async () => {
    if (!user || backgroundUploadStarted.current) return;
    backgroundUploadStarted.current = true;

    try {
      const url = `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${encodeURIComponent(user.id)}&size=256`;
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], `${user.id}-avatar.png`, { type: "image/png" });
      await user.setProfileImage({ file });
    } catch (err) {
      backgroundUploadStarted.current = false;
      throw err;
    }
  };


  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded) return;

      else if (!user) router.push("/sign-in");

      // If they already finished onboarding, redirect to home page.
      else if (user.unsafeMetadata?.onboardingComplete) router.push("/");

      // If they signed up with an external account, they don't need to set a profile picture.
      else if (user.externalAccounts && user.externalAccounts.length > 0) {
        await user.update({ unsafeMetadata: { onboardingComplete: true } });
        router.push("/");
      }

      else {
        setRandomAvatar().catch(console.error);
        setIsChecking(false);
      }
    };

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || isChecking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        }}
      >
        <CircularProgress sx={{ color: "#1a2a5a" }} />
      </Box>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const applyRandomAvatar = async () => {
    setIsUploading(true);
    try {
      await user.update({ unsafeMetadata: { onboardingComplete: true } });
      const isOAuth = user?.externalAccounts && user.externalAccounts.length > 0;
      if (!isOAuth) await setRandomAvatar();
      router.push("/");
    } catch (err) {
      console.error("Failed to upload default image:", err);
      router.push("/");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!selectedFile) {
      await applyRandomAvatar();
      return;
    }

    setIsUploading(true);
    try {
      await user.update({ unsafeMetadata: { onboardingComplete: true } });
      await user.setProfileImage({ file: selectedFile });
      router.push("/");
    } catch (err) {
      console.error("Failed to upload image:", err);
      router.push("/");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          direction: "rtl",
          textAlign: "center",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: "#1a2a5a", mb: 1 }}
        >
          ברוך הבא ל-Ina Club! 🎉
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
          יצרנו עבורך תמונת פרופיל ייחודית, אך תוכל/י להעלות תמונה משלך אם תרצה/י.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            src={previewUrl || `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${encodeURIComponent(user.id)}&size=256`}
            sx={{ width: 120, height: 120, border: "2px solid #e2e8f0" }}
          />
        </Box>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon sx={{ ml: 1, mr: -1 }} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          sx={{
            mb: 4,
            width: "100%",
            color: "#1a2a5a",
            borderColor: "#1a2a5a",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              borderColor: "#1a2a5a",
              backgroundColor: "rgba(26, 42, 90, 0.04)",
            },
          }}
        >
          בחר תמונה אחרת
        </Button>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSaveAndContinue}
            disabled={isUploading}
            sx={{
              backgroundColor: "#1a2a5a",
              borderRadius: "8px",
              fontWeight: 600,
              py: 1.2,
              "&:hover": {
                backgroundColor: "#243a7a",
              },
            }}
          >
            {isUploading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : selectedFile ? (
              "שמור והצטרף למועדון"
            ) : (
              "המשך עם התמונה הזו"
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
