"use client";

import { forwardRef, useMemo } from "react";
import Avatar, { type AvatarProps } from "@mui/material/Avatar";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { getAvatarInitials } from "lib/utils/avatar";
import React from "react";

const COLOR_PALETTE = [
  "#1F2937",
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#0EA5E9",
];

function stringToNumber(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }
  return Math.abs(hash);
}

function getBackgroundColor(identifier?: string | null) {
  if (!identifier?.trim()) return COLOR_PALETTE[0];
  const hash = stringToNumber(identifier);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

export interface UserAvatarProps extends AvatarProps {
  name?: string | null;
  identifier?: string | null;
  imageUrl?: string | null;
}

const UserAvatarBase = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ name, identifier, imageUrl, sx, children, src, ...rest }, ref) => {
    const resolvedSrc = imageUrl ?? (typeof src === "string" ? src : undefined);

    const initials = useMemo(() => getAvatarInitials(name), [name]);

    const backgroundColor = useMemo(
      () => getBackgroundColor(identifier || name || ""),
      [identifier, name]
    );

    const mergedSx = useMemo(
      () => ({
        bgcolor: resolvedSrc ? undefined : backgroundColor,
        color: resolvedSrc ? undefined : "#fff",
        fontWeight: 600,
        textTransform: "uppercase",
        ...sx,
      }),
      [resolvedSrc, backgroundColor, sx]
    );

    return (
      <Avatar ref={ref} src={resolvedSrc} sx={mergedSx} {...rest}>
        {!resolvedSrc ? children ?? initials : null}
      </Avatar>
    );
  }
);

export const UserAvatar = React.memo(UserAvatarBase);
export default UserAvatar;
