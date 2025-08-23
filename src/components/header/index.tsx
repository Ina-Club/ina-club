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
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";
import { usePathname } from "next/navigation";

const loggedIn = false;

const navigationItems = [
  { title: "בקשות", href: "/requestGroups", icon: ShoppingBagIcon },
  { title: "קבוצות פעילות", href: "/activeGroups", icon: GroupIcon },
  { title: "חיפוש חכם", href: "/search", icon: SearchIcon },
  { title: "מנתח מחירים", href: "/price-analyzer", icon: TrendingUpIcon },
];

const mobileNavigationItems = [
  ...navigationItems,
  { title: "מועדפים", href: "/favorites", icon: FavoriteIcon },
];

export default function Header() {
  const pathname = usePathname();
  const currentTab = navigationItems.findIndex(
    (item) => item.href === pathname
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "#fff",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Right side (Logo + Tabs) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* לוגו */}
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/InaClubLogo.png"
                alt="Ina Club Logo"
                width={90}
                height={60}
              />
            </Link>

            {/* ניווט מרכזי (רק בדסקטופ) */}
            <Tabs
              value={currentTab >= 0 ? currentTab : false}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {navigationItems.map((item, index) => {
                const isActive = index === currentTab;
                return (
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
                      color: isActive ? "#1a2a5a" : "#64748b",
                      backgroundColor: isActive ? "#dbeafe" : "transparent",
                      "&:hover": {
                        color: "#1a2a5a",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Left side */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {/* מועדפים */}

            {/* צור בקשה */}
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
              <AddIcon sx={{ ml: 1 }} />
              צור בקשה
            </Button>

            <IconButton sx={{ color: "#64748b" }}>
              <FavoriteIcon />
            </IconButton>

            {/* פרופיל */}
            <IconButton sx={{ color: "#64748b" }}>
              {loggedIn ? (
                <Image
                  src="/InaclubAppLogo.png"
                  alt="Ina Club App Logo"
                  width={40}
                  height={40}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
          </Box>

          {/* Mobile Menu Button */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              py: "12px",
              justifyContent: "center",
            }}
          >
            <IconButton sx={{ color: "#64748b" }}>
              {loggedIn ? (
                <Image
                  src="/InaclubAppLogo.png"
                  alt="Ina Club App Logo"
                  width={40}
                  height={40}
                />
              ) : (
                <AccountCircleIcon />
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
        sx={{ "& .MuiDrawer-paper": { width: 250 } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Image
              src="/InaClubLogo.png"
              alt="Ina Club Logo"
              width={100}
              height={70}
            />
          </Box>

          {/* צור בקשה - ממורכז */}

          <Divider>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                component={Link}
                href="/create"
                variant="outlined"
                fullWidth
                sx={{
                  color: "#1a2a5a",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "24px",
                  borderColor: "#1a2a5a",
                }}
                onClick={() => setDrawerOpen(false)}
              >
                <AddIcon sx={{ ml: 1 }} />
                צור בקשה
              </Button>
            </Box>
          </Divider>

          {/* Navigation Links */}
          <List sx={{ flexGrow: 1 }}>
            {mobileNavigationItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <ListItemButton
                  key={item.title}
                  component={Link}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: isActive ? "#1a2a5a" : "#64748b",
                    backgroundColor: isActive ? "#dbeafe" : "transparent",
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
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
