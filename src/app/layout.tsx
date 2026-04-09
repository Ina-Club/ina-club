import Footer from "@/components/footer";
import HeaderWrapper from "@/components/wrapper/header-wrapper"; // ✅ חדש
import ThemeRegistry from "@/components/theme-registry/theme-registry";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProfileProvider } from "@/contexts/user-profile-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { Box } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ina Club — קניות קבוצתיות חכמות",
  description:
    "בקשות מהקהילה, קבוצות רכישה פעילות, חיפוש חכם ומנתח מחירים — הכל במקום אחד.",
  icons: { icon: "/InaAppLogo.png" },
};

import { SnackbarProvider } from "@/contexts/snackbar-context";
import { CLERK_APPEARANCE_CONFIG, CLERK_LOCALIZATION_CONFIG } from "@/lib/clerk-config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={CLERK_APPEARANCE_CONFIG}
      localization={CLERK_LOCALIZATION_CONFIG}
      signUpUrl="/sign-up"
      signInUrl="/sign-in"
    >
      {" "}
      <ThemeRegistry>
        <html lang="he" dir="rtl">
          <body
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              margin: 0,
            }}
          >
            <UserProfileProvider>
              <SnackbarProvider>
                <FavoritesProvider>
                  <HeaderWrapper />
                  <main style={{ flex: 1 }}>{children}</main>
                  <Footer />
                </FavoritesProvider>
              </SnackbarProvider>
            </UserProfileProvider>
          </body>
        </html>
      </ThemeRegistry>
    </ClerkProvider>
  );
}
