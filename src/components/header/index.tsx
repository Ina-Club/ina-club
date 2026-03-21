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
  Menu,
  MenuItem,
  Collapse,
  Divider,
} from "@mui/material";

import Link from "next/link";
import Image from "next/image";
import { memo, useMemo, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { useUserProfile } from "@/contexts/user-profile-context";

import UserAvatar from "@/components/user-avatar";

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
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// -----------------------------
// STATIC — DOES NOT RECREATE
// -----------------------------

type MenuItemConfig = {
  key: string;
  href: string | null;
  label: string;
  icon: typeof PersonIcon;
  color?: string;
  bg?: string;
  action?: "logout";
};

type NavLinkItem = {
  title: string;
  href: string;
  icon: typeof PersonIcon;
  menuItems?: undefined;
};

type NavDropdownItem = {
  title: string;
  href?: null;
  icon: typeof PersonIcon;
  menuItems: { label: string; href: string }[];
};

type NavItem = NavLinkItem | NavDropdownItem;

const NAV_ITEMS: (NavLinkItem | NavDropdownItem)[] = [
  { title: "קבוצות פעילות", href: "/active-groups", icon: GroupIcon },
  { title: "בקשות", href: "/request-groups", icon: ShoppingBagIcon },
  { title: "חיפוש חכם", href: "/smart-search", icon: SearchIcon },
  { title: "מנתח מחירים", href: "/price-analyzer", icon: TrendingUpIcon },
  {
    title: "עוד",
    href: null,
    icon: ExpandMoreIcon,
    menuItems: [
      { label: "מי אנחנו", href: "/about" },
      { label: "מדיניות פרטיות", href: "/privacy-policy" },
      { label: "תנאי שימוש", href: "/terms" },
      { label: "צור קשר", href: "/contact" },
    ],
  },
];

const MOBILE_ITEMS = [
  { title: "פרופיל", href: "/profile", icon: PersonIcon },
  { title: "מועדפים", href: "/profile?tab=liked", icon: FavoriteIcon },
  ...NAV_ITEMS,
];

const LOGGED_IN_MENU: MenuItemConfig[] = [
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
    color: "#dc2626",
    action: "logout",
  },
];

const LOGGED_OUT_MENU: MenuItemConfig[] = [
  {
    key: "signin",
    href: "/sign-in",
    label: "התחברות",
    icon: LoginIcon,
    color: "#64748b",
  },
  {
    key: "signup",
    href: "/sign-up",
    label: "הרשמה",
    icon: HowToRegIcon,
    color: "#fff",
    bg: "#1a2a5a",
  },
];

// -----------------------------
// COMPONENT START
// -----------------------------

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { profile } = useUserProfile();

  // compute selected tab
  const currentTab = useMemo(
    () => NAV_ITEMS.findIndex((i) => i.href === pathname),
    [pathname]
  );

  // anchor states
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const avatarSx = useMemo(
    () => ({ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderColor: "primary.main" }),
    []
  );

  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleMoreOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setMoreAnchor(e.currentTarget);
  }, []);

  const handleMoreClose = useCallback(() => setMoreAnchor(null), []);

  const handleItemClick = useCallback(
    (item: MenuItemConfig) => {
      handleMenuClose();

      if (item.action === "logout") {
        return;
      }

      if (item.href) router.push(item.href);
    },
    [handleMenuClose, router]
  );

  const memoUserName = profile?.name || "";
  const memoUserIdentifier = profile?.email || "";
  const memoUserImage = profile?.profilePicture || null;
  
  // Note: we use Clerk's components for the actual auth state display in the toolbar
  // but keep the menu for other links if needed.
  const goToFavorites = useCallback(() => {
    router.push("/profile?tab=liked");
  }, [router]);

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column", pb: 4, bgcolor: "#f5f7fa" }}>
          <Box sx={{ bgcolor: "#f5f7fa", py: 1 }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mx: 1,
            }}>
              <Box sx={{ display: "flex" }}>
                <Image
                  src="/InaClubLogo.png"
                  alt="Ina Club Logo"
                  width={90}
                  height={60}
                />
              </Box>
              <IconButton
                onClick={() => setDrawerOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
          </Box>
          <List>
            {MOBILE_ITEMS.map((item) => {
              const Icon = item.icon;

              // mobile sub-menu for "עוד"
              if ("menuItems" in item) {
                const subItems = item.menuItems ?? [];
                return (
                  <Box key={item.title}>
                    <ListItemButton onClick={() => setMobileMoreOpen((prev) => !prev)}>
                      <ListItemIcon>
                        <Icon sx={{
                          transform: mobileMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "0.3s",
                        }} />
                      </ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                    <Collapse in={mobileMoreOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {subItems.map((sub) => (
                          <ListItemButton
                            key={sub.href}
                            component={Link}
                            href={sub.href}
                            onClick={() => setDrawerOpen(false)}
                            sx={{ pl: 6 }}
                          >
                            <ListItemText primary={sub.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                );
              }

              return (
                <ListItemButton
                  key={item.title}
                  component={Link}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ mb: 3 }} />
          </Box>
        </Box>
      </Drawer>
      <AppBar
        position="sticky"
        sx={{
          background: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          top: 0,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo + Tabs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                sx={{ p: 0, display: { xs: "flex", md: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/" style={{ display: "flex" }}>
                <Image
                  src="/InaClubLogo.png"
                  alt="Ina Club Logo"
                  width={90}
                  height={60}
                />
              </Link>
            </Box>
            <Tabs
              value={currentTab >= 0 ? currentTab : false}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;

                // special case for dropdown "עוד"
                if (item.menuItems) {
                  return (
                    <Tab
                      key={item.title}
                      label={item.title}
                      icon={<Icon />}
                      iconPosition="start"
                      onClick={handleMoreOpen}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        px: 2,
                        justifyContent: "flex-end",
                        borderRadius: "16px",
                        color: "#64748b",
                        flexDirection: "row-reverse",
                        ".MuiTab-iconWrapper": {
                          marginLeft: "8px",
                          marginRight: 0,
                        },
                      }}
                    />
                  );
                }

                return (
                  <Tab
                    key={item.title}
                    label={item.title}
                    icon={<Icon />}
                    iconPosition="start"
                    component={Link}
                    href={item.href}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      px: 2,
                      borderRadius: "16px",
                      flexDirection: "row-reverse",
                      ".MuiTab-iconWrapper": {
                        marginLeft: "8px",
                        marginRight: 0,
                      },
                      color: idx === currentTab ? "#1a2a5a" : "#64748b",
                    }}
                  />
                );
              })}
            </Tabs>

            <Menu
              anchorEl={moreAnchor}
              open={!!moreAnchor}
              onClose={handleMoreClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {NAV_ITEMS.find(
                (i): i is NavDropdownItem => "menuItems" in i
              )?.menuItems?.map((sub) => (
                <MenuItem
                  key={sub.href}
                  component={Link}
                  href={sub.href}
                  onClick={handleMoreClose}
                >
                  {sub.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Right */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <IconButton sx={{ color: "#64748b" }} onClick={goToFavorites}>
              <FavoriteIcon />
            </IconButton>

            <Show when="signed-in">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 40,
                      height: 40
                    }
                  }
                }}
              />
            </Show>
            <Show when="signed-out">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button 
                  component={Link} 
                  href="/sign-in" 
                  variant="text"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  התחברות
                </Button>
                <Button 
                  component={Link} 
                  href="/sign-up" 
                  variant="contained"
                  sx={{ 
                    bgcolor: "#1a2a5a", 
                    borderRadius: "20px",
                    px: 3,
                    "&:hover": { bgcolor: "#243a7a" }
                  }}
                >
                  הרשמה
                </Button>
              </Box>
            </Show>
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1, alignItems: "center" }}>
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <IconButton component={Link} href="/sign-in" sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ fontSize: 40, color: "#64748b" }} />
              </IconButton>
            </Show>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default memo(Header);
