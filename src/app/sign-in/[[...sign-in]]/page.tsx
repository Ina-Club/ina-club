import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
      }}
    >
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#1a2a5a",
            borderRadius: "10px",
            fontFamily: '"Inter", sans-serif',
          },
          elements: {
            /* Main card */
            card: {
              direction: "rtl",
              textAlign: "right",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
            },

            /* Header */
            headerTitle: {
              textAlign: "right",
              color: "#1a2a5a",
              fontWeight: "700",
            },
            headerSubtitle: {
              textAlign: "right",
              color: "#6b7280",
            },

            /* Inputs */
            formFieldInput: {
              direction: "rtl",
              textAlign: "right",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              "&:focus": {
                borderColor: "#1a2a5a",
                boxShadow: "0 0 0 2px rgba(26, 42, 90, 0.15)",
              },
            },

            formFieldLabel: {
              textAlign: "right",
              fontWeight: "500",
              color: "#374151",
            },

            /* Primary button */
            formButtonPrimary: {
              backgroundColor: "#1a2a5a",
              borderRadius: "8px",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "#243a7a",
              },
            },

            /* Social login buttons */
            socialButtonsBlockButton: {
              borderRadius: "8px",
              border: "1px solid #1a2a5a",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            },

            /* Links */
            footerPageLink: {
              color: "#1a2a5a",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              },
            },

            /* Spinner */
            spinner: {
              color: "#1a2a5a",
            },
          },
        }}
        signUpUrl="/sign-up"
      />
    </Box>
  );
}
