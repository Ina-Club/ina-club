"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { Company } from "lib/dal";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        width: 320,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        gap: 1,
        transition: "transform 0.25s, box-shadow 0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <CardMedia
          component="img"
          image={company.logo}
          alt={company.title}
          sx={{
            width: 60,
            height: 60,
            objectFit: "contain",
          }}
        />
      </Box>
      {/* תוכן */}
      <Box sx={{ flexGrow: 1, pr: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {company.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {company.subTitle}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", mt: 0.5, gap: 1 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {company.categories.join(", ")}
          </Typography>
        </Box>
      </Box>

      {/* לוגו ואייקון */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          height: "100%",
          gap: 0.5,
        }}
      >
      <IconButton
          size="small"
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "primary.main" }}
        >
          <LaunchIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CompanyCard;
