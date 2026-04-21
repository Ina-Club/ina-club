"use client";

import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import UserAvatar from "@/components/user-avatar";

export default function ProfileButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleGoToProfile = useCallback(() => {
    handleCloseMenu();
    router.push("/profile");
  }, [handleCloseMenu, router]);

  const handleSignOut = useCallback(async () => {
    handleCloseMenu();
    await signOut({ redirectUrl: "/" });
  }, [handleCloseMenu, signOut]);

  const userName = useMemo(
    () => user?.fullName || user?.username || "הפרופיל שלי",
    [user],
  );

  const userEmail = useMemo(
    () => user?.primaryEmailAddress?.emailAddress || "",
    [user],
  );

  if (!user) return null;

  return (
    <>
      <ButtonBase
        onClick={handleOpenMenu}
        sx={{
          borderRadius: "999px",
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 8px 24px rgba(26, 42, 90, 0.14)",
          },
        }}
      >
        <UserAvatar
          name={userName}
          identifier={userEmail}
          imageUrl={user.imageUrl}
          sx={{
            width: { xs: 40, md: 40 },
            height: { xs: 40, md: 40 },
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.25,
              minWidth: 240,
              overflow: "visible",
              borderRadius: "20px",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              boxShadow: "0 18px 50px rgba(15, 23, 42, 0.16)",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
            },
          },
          list: {
            sx: {
              py: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}
          >
            {userName}
          </Typography>
          {userEmail ? (
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mt: 0.5, direction: "ltr" }}
            >
              {userEmail}
            </Typography>
          ) : null}
        </Box>

        <Divider />

        <MenuItem
          onClick={handleGoToProfile}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: "14px",
            py: 1.2,
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: "#1a2a5a" }} />
          </ListItemIcon>
          <ListItemText
            primary="לפרופיל שלי"
            secondary="ניהול פרטים, מועדפים ופעילות"
            primaryTypographyProps={{ sx: { fontWeight: 600, color: "#0f172a" } }}
            secondaryTypographyProps={{ sx: { color: "#64748b" } }}
          />
        </MenuItem>

        <MenuItem
          onClick={handleSignOut}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: "14px",
            py: 1.2,
            color: "#b42318",
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#b42318" }} />
          </ListItemIcon>
          <ListItemText
            primary="התנתק"
            secondary="יציאה בטוחה מהחשבון"
            primaryTypographyProps={{ sx: { fontWeight: 600 } }}
            secondaryTypographyProps={{ sx: { color: "#b07a7a" } }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
