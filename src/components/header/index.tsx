"use client";

import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: "linear-gradient(90deg, #1976d2, #42a5f5)", 
        boxShadow: "0px 3px 10px rgba(0,0,0,0.2)" 
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* לוגו */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/InaLogo.png"
            alt="Ina Club Logo"
            width={60}
            height={40}
          />
        </Link>

        {/* תפריט מרכזי */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Link href="/groups" style={{ color: "#fff", textDecoration: "none" }}>
            קבוצות פעילות
          </Link>
          <Link href="/requests" style={{ color: "#fff", textDecoration: "none" }}>
            בקשות חדשות
          </Link>
          <Button
            component={Link}
            href="/create"
            variant="contained"
            sx={{
              backgroundColor: "#ff9800",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#f57c00" },
            }}
          >
            + צור בקשה חדשה
          </Button>
        </Box>

        {/* אייקונים בצד ימין */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton sx={{ color: "#fff" }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton sx={{ color: "#fff" }}>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
