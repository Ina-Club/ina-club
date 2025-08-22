"use client";

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { usePathname } from "next/navigation";

const navigationItems = [
  { title: "בקשות", href: "/requests", icon: ShoppingBagIcon },
  { title: "קבוצות פעילות", href: "/groups", icon: GroupIcon },
  { title: "חיפוש חכם", href: "/search", icon: SearchIcon },
  { title: "מנתח מחירים", href: "/price-analyzer", icon: TrendingUpIcon },
];

export default function Header() {
  const pathname = usePathname();
  const currentTab = navigationItems.findIndex(
    (item) => item.href === pathname
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: "#fff",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* לוגו */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/InaClubLogo.png"
              alt="Ina Club Logo"
              width={80}
              height={60}
            />
          </Link>

          {/* ניווט מרכזי */}
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
                    color: isActive ? "#3b82f6" : "#64748b",
                    backgroundColor: isActive ? "#dbeafe" : "transparent",
                    "&:hover": {
                      color: "#3b82f6",
                      backgroundColor: "#f8fafc",
                    },
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* אייקונים + כפתור בצד ימין */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            component={Link}
            href="/create"
            variant="outlined"
            sx={{
              minWidth: 32,
              width: 32,
              height: 32,
              borderRadius: "50%", // מצב רגיל מידי
              borderColor: "#3b82f6",
              color: "#3b82f6",
              backgroundColor: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: 0,
              transition: "width 0.3s ease", // רק הרוחב יעבור בהדרגה
              "&:hover": {
                width: 120,
                borderRadius: "24px", // שינוי מידי כשעכבר מעל
              },
            }}
          >
            {/* ה־+ קבוע בצד שמאל */}
            <Box sx={{ direction: "rtl", display: "flex", marginLeft: "3px" }}>
              {/* הטקסט שמופיע כשהכפתור מורחב */}
              <Box
                component="span"
                sx={{
                  whiteSpace: "nowrap",
                  ml: 2,
                  opacity: 1,
                  transition: "opacity 0.3s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                צור בקשה
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon />
              </Box>
            </Box>
          </Button>
          <IconButton sx={{ color: "#64748b" }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton sx={{ color: "#64748b" }}>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
