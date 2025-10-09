"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Header from "@/components/header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    // דף הבית → header סטיקי
    return (
      <Box position="sticky" top={0} zIndex={1000}>
        <Header />
      </Box>
    );
  }

  // שאר הדפים → header רגיל
  return <Header />;
}
