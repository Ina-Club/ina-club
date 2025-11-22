"use client";

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import Link from "next/link";
import Image from "next/image";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  HowToReg as HowToRegIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useUserProfile } from "@/contexts/user-profile-context";
import UserAvatar from "@/components/user-avatar";

const navigationItems = [
  { title: "בקשות", href: "/request-groups", icon: ShoppingBagIcon },
  { title: "קבוצות פעילות", href: "/active-groups", icon: GroupIcon },
  { title: "חיפוש חכם", href: "/smart-search", icon: SearchIcon },
  { title: "מנתח מחירים", href: "/price-analyzer", icon: TrendingUpIcon },
];

const mobileNav = [
  ...navigationItems,
  { title: "פרופיל", href: "/profile", icon: PersonIcon },
  { title: "מועדפים", href: "/favorites", icon: FavoriteIcon },
];

export default function Header() {
  const pathname = usePathname();

  const currentTab = navigationItems.findIndex((i) => i.href === pathname);

  const { profile } = useUserProfile();
  const { data: session } = useSession();

  const loggedIn = !!session;

  // מייצב את הנתונים של המשתמש
  const memoUserName = useMemo(
    () => profile?.name || session?.user?.name || null,
    [profile?.name, session?.user?.name]
  );

  const memoUserImage = useMemo(
    () => profile?.profilePicture || session?.user?.image || null,
    [profile?.profilePicture, session?.user?.image]
  );

  const memoUserIdentifier = useMemo(
    () => session?.user?.email || null,
    [session?.user?.email]
  );

  const avatarSx = useMemo(
    () => ({
      width: 40,
      height: 40,
      borderColor: "primary.main",
    }),
    []
  );

  // פרופיל תפריט — יציב ב־useMemo
  const profileMenuItems = useMemo(() => {
    if (loggedIn) {
      return [
        {
          key: "profile",
          href: "/profile",
          label: "פרופיל",
          icon: PersonIcon,
          color: "#64748b",
        },
        {
          key: "logout",
          href: null,
          label: "התנתק",
          icon: LogoutIcon,
          action: () => signOut(),
          color: "#dc2626",
        },
      ];
    }
    return [
      {
        key: "signin",
        href: "/auth/signin",
        label: "התחברות",
        icon: LoginIcon,
        color: "#64748b",
      },
      {
        key: "signup",
        href: "/auth/signup",
        label: "הרשמה",
        icon: HowToRegIcon,
        color: "#fff",
        bg: "#1a2a5a",
      },
    ];
  }, [loggedIn]);

  // anchor controlling menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(menuAnchor);

  return (
    <>
      <AppBar position="static" sx={{ background: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo + Tabs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/">
              <Image src="/InaClubLogo.png" alt="Ina Club Logo" width={90} height={60} />
            </Link>

            <Tabs value={currentTab >= 0 ? currentTab : false} sx={{ display: { xs: "none", md: "flex" } }}>
              {navigationItems.map((item, idx) => (
                <Tab
                  key={item.title}
                  label={item.title}
                  icon={<item.icon />}
                  iconPosition="start"
                  component={Link}
                  href={item.href}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    px: 2,
                    borderRadius: "16px",
                    color: idx === currentTab ? "#1a2a5a" : "#64748b",
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Desktop Right */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              component={Link}
              href="/create"
              variant="outlined"
              sx={{
                borderRadius: "999px",
                color: "#1a2a5a",
                borderColor: "#1a2a5a",
                px: 2,
                fontWeight: 600,
              }}
            >
              <AddIcon sx={{ ml: 1 }} />
              צור בקשה
            </Button>

            <IconButton sx={{ color: "#64748b" }}>
              <FavoriteIcon />
            </IconButton>

            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0 }}>
              {loggedIn ? (
                <UserAvatar
                  name={memoUserName}
                  identifier={memoUserIdentifier}
                  imageUrl={memoUserImage}
                  sx={avatarSx}
                />
              ) : (
                <AccountCircleIcon sx={{ color: "#64748b", fontSize: 40 }} />
              )}
            </IconButton>

            <Menu anchorEl={menuAnchor} open={openMenu} onClose={() => setMenuAnchor(null)}>
              {profileMenuItems.map((item) => (
                <MenuItem
                  key={item.key}
                  onClick={() => {
                    setMenuAnchor(null);
                    item.action?.();
                    if (item.href) window.location.href = item.href;
                  }}
                >
                  <item.icon sx={{ mr: 1 }} />
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0 }}>
              {loggedIn ? (
                <UserAvatar
                  name={memoUserName}
                  identifier={memoUserIdentifier}
                  imageUrl={memoUserImage}
                  sx={avatarSx}
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 40, color: "#64748b" }} />
              )}
            </IconButton>

            <IconButton onClick={() => setDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
