import { Box, Chip, Typography } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import { CouponData } from "@/lib/dal";
import { CouponStatus } from "@/lib/types/status";

interface CouponCardProps {
  coupon: CouponData;
}

function resolveStatus(coupon: CouponData): {
  label: string;
  color: "success" | "error" | "default";
  isActive: boolean;
} {
  if (coupon.status === CouponStatus.USED)
    return { label: "מומש", color: "default", isActive: false };
  if (coupon.status === CouponStatus.EXPIRED || new Date(coupon.validTo) < new Date())
    return { label: "פג תוקף", color: "error", isActive: false };
  return { label: "פעיל", color: "success", isActive: true };
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const { label, color, isActive } = resolveStatus(coupon);

  const validToFormatted = new Date(coupon.validTo).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        border: "2px dashed",
        borderColor: isActive ? "success.main" : color === "error" ? "error.main" : "grey.400",
        borderRadius: 3,
        p: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        bgcolor: isActive ? "success.50" : "background.paper",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.08)" : undefined,
        },
      }}
    >
      <LocalOfferIcon
        sx={{
          color: isActive ? "success.main" : "text.disabled",
          fontSize: 36,
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h5"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing={3}
          color={isActive ? "success.dark" : "text.disabled"}
          sx={{ wordBreak: "break-all" }}
        >
          {coupon.code}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          קבוצה:{" "}
          <Link
            href={`/active-groups/${coupon.groupId}`}
            style={{ color: "inherit", fontWeight: 600 }}
          >
            {coupon.groupTitle}
          </Link>
        </Typography>

        <Typography variant="caption" color="text.secondary">
          בתוקף עד: {validToFormatted}
        </Typography>
      </Box>

      <Chip label={label} color={color} size="small" sx={{ flexShrink: 0 }} />
    </Box>
  );
}
