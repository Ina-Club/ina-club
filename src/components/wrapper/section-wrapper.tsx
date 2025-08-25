import { Box, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";

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
        py: 12
      }}
    >
      <Stack
        marginBottom={"30px"}
        flexDirection={"row"}
        alignItems={"center"} // changed to flex-start for subtitle alignment
        justifyContent={"space-between"}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "34px",
                md: "38px",
              },
              mb: subTitle ? "5px" : "10.5px", // smaller margin if subtitle exists
              fontWeight: 500,
              paddingTop: "5px",
            }}
            variant="h2"
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
            variant="outlined"
            sx={{
              borderRadius: "12px",
              px: "22px",
              py: "6px",
              fontSize: "16px",
              textTransform: "none",
              color: "#1a2a5a",
              borderColor: "#1a2a5a",
              "&:hover": {
                backgroundColor: "rgba(145, 57, 214, 0.04)",
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
