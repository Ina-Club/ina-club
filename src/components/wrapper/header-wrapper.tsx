"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import Header from "@/components/header";

function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = useMemo(() => pathname === "/", [pathname]);

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

export default memo(HeaderWrapper);
