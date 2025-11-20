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
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Paper,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  ShoppingBag as ShoppingBagIcon,
  Group as GroupIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  HowToReg as HowToRegIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { getAvatarInitials } from "lib/utils/avatar";
import { useUserProfile } from "@/contexts/user-profile-context";

const navigationItems = [
  { title: "בקשות", href: "/request-groups", icon: ShoppingBagIcon },
  { title: "קבוצות פעילות", href: "/active-groups", icon: GroupIcon },
  { title: "חיפוש חכם", href: "/smart-search", icon: SearchIcon },
  { title: "מנתח מחירים", href: "/price-analyzer", icon: TrendingUpIcon },
];

const mobileNavigationItems = [
  ...navigationItems,
  { title: "פרופיל", href: "/profile", icon: AccountCircleIcon },
  { title: "מועדפים", href: "/favorites", icon: FavoriteIcon },
];

export default function Header() {
  const pathname = usePathname();
  const currentTab = navigationItems.findIndex(
    (item) => item.href === pathname
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile } = useUserProfile();

  // NextAuth session
  const { data: session } = useSession();
  const loggedIn = !!session;
  const profilePicture = profile?.profilePicture || session?.user?.image || null;
  const userName = profile?.name || session?.user?.name || null;

  // Profile Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const profileMenuItems = loggedIn
    ? [
        <MenuItem
          key="profile"
          onClick={() => {
            handleMenuClose();
            window.location.href = "/profile";
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc',
              color: '#1a2a5a',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <PersonIcon sx={{ fontSize: 20, color: '#64748b' }} />
          <Typography sx={{ fontWeight: 500 }}>פרופיל</Typography>
        </MenuItem>,
        <MenuItem
          key="signout"
          onClick={() => {
            handleMenuClose();
            signOut();
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.2s',
            color: '#dc2626',
            '&:hover': {
              backgroundColor: '#fef2f2',
              color: '#dc2626',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <LogoutIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontWeight: 500 }}>התנתק</Typography>
        </MenuItem>,
      ]
    : [
       
        <MenuItem
          key="signin"
          onClick={() => {
            handleMenuClose();
            window.location.href = "/auth/signin";
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc',
              color: '#1a2a5a',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <LoginIcon sx={{ fontSize: 20, color: '#64748b' }} />
          <Typography sx={{ fontWeight: 500 }}>התחברות</Typography>
        </MenuItem>,
        <MenuItem
          key="signup"
          onClick={() => {
            handleMenuClose();
            window.location.href = "/auth/signup";
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: 'all 0.2s',
            backgroundColor: '#1a2a5a',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#0f172a',
              color: '#fff',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <HowToRegIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontWeight: 600 }}>הרשמה</Typography>
        </MenuItem>,
      ];

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: "#fff", boxShadow: "0px 3px 10px rgba(0,0,0,0.2)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo + Tabs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/InaClubLogo.png"
                alt="Ina Club Logo"
                width={90}
                height={60}
              />
            </Link>
            <Tabs
              value={currentTab >= 0 ? currentTab : false}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {navigationItems.map((item, index) => (
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
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: "1rem",
                    transition: "all 0.2s",
                    color: index === currentTab ? "#1a2a5a" : "#64748b",
                    "&:hover": { color: "#1a2a5a", backgroundColor: "#f8fafc" },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Desktop Right Side */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              href="/create"
              variant="outlined"
              sx={{
                minWidth: 32,
                height: 32,
                color: "#1a2a5a",
                fontWeight: "bold",
                textTransform: "none",
                px: 2,
                borderRadius: "24px",
                backgroundColor: "#fff",
                borderColor: "#1a2a5a",
              }}
            >
              <AddIcon sx={{ ml: 1 }} /> צור בקשה
            </Button>

            <IconButton sx={{ color: "#64748b" }}>
              <FavoriteIcon />
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                borderRadius: '50%',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }
              }}
            >
              {loggedIn ? (
                <Avatar
                  src={profilePicture || undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    borderColor: 'primary.main',
                  }}
                >
                  {!profilePicture && userName ? getAvatarInitials(userName) : null}
                  {!profilePicture && !userName && <AccountCircleIcon />}
                </Avatar>
              ) : (
                <AccountCircleIcon
                  sx={{
                    fontSize: 40,
                    color: "#64748b",
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: '#1a2a5a',
                    }
                  }}
                />
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  mt: 1,
                  minWidth: 200,
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {profileMenuItems}
            </Menu>
          </Box>

          {/* Mobile Right Side */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                borderRadius: '50%',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }
              }}
            >
              {loggedIn && profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Avatar"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    transition: 'border-color 0.2s',
                  }}
                />
              ) : (
                <AccountCircleIcon
                  sx={{
                    fontSize: 40,
                    color: "#64748b",
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: '#1a2a5a',
                    }
                  }}
                />
              )}
            </IconButton>
            <IconButton
              sx={{ color: "#1a2a5a" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Image
              src="/InaClubLogo.png"
              alt="Ina Club Logo"
              width={100}
              height={70}
            />
          </Box>

          <Divider>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  color: "#1a2a5a",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "24px",
                  borderColor: "#1a2a5a",
                }}
                component={Link}
                href="/create"
              >
                <AddIcon sx={{ ml: 1 }} /> צור בקשה
              </Button>
            </Box>
          </Divider>

          <List sx={{ flexGrow: 1 }}>
            {mobileNavigationItems.map((item) => (
              <ListItemButton
                key={item.title}
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: item.href === pathname ? "#1a2a5a" : "#64748b",
                  backgroundColor:
                    item.href === pathname ? "#dbeafe" : "transparent",
                  "&:hover": { backgroundColor: "#f8fafc" },
                }}
              >
                <ListItemText
                  dir="rtl"
                  sx={{ textAlign: "start" }}
                  primary={item.title}
                />
                <ListItemIcon dir="ltr">
                  <item.icon />
                </ListItemIcon>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
