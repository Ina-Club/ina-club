"use client";

import { Box, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

interface SectionWrapperProps {
  title: string;
  subTitle?: string;
  linkLabel?: string;
  linkUrl?: string;
  children?: React.ReactNode;
  disableMargin?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  linkLabel,
  linkUrl,
  subTitle,
  children,
  disableMargin,
}) => {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 12 },
      }}
    >
      <Stack
        marginBottom={"30px"}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent={"space-between"}
        gap={{ xs: 1.5, md: 2 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "28px",
                md: "32px",
              },
              mb: subTitle ? "5px" : "10.5px",
              fontWeight: 800,
              paddingTop: "5px",
              color: "primary.main",
            }}
            variant="h2"
            component="h2"
          >
            {title}
          </Typography>

          {subTitle && (
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  md: "20px",
                },
                color: "text.secondary",
              }}
              variant="subtitle1"
            >
              {subTitle}
            </Typography>
          )}
        </Box>

        {linkUrl && (
          <Button
            component={Link}
            href={linkUrl}
            endIcon={<ArrowOutwardIcon sx={{ fontSize: 18 }} />}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              justifyContent: { xs: "space-between", sm: "center" },
              borderRadius: { xs: "18px", md: "12px" },
              px: { xs: 2, md: "22px" },
              py: { xs: 1.2, md: "6px" },
              fontSize: { xs: "15px", md: "16px" },
              textTransform: "none",
              color: "#1a2a5a",
              border: {
                xs: "1px solid rgba(26, 42, 90, 0.08)",
                md: "1px solid #1a2a5a",
              },
              background: {
                xs: "linear-gradient(180deg, rgba(245, 247, 255, 0.96), rgba(255, 255, 255, 0.96))",
                md: "transparent",
              },
              boxShadow: {
                xs: "0 8px 24px rgba(26, 42, 90, 0.08)",
                md: "none",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 140, 66, 0.04)",
                borderColor: "#1a2a5a",
              },
              "& .MuiButton-endIcon": {
                marginRight: 0,
                marginLeft: 1,
              },
            }}
          >
            {linkLabel}
          </Button>
        )}
      </Stack>

      {children}
    </Box>
  );
};

export default SectionWrapper;
