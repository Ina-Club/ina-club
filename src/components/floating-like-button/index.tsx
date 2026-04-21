"use client";

import { useState, useEffect } from "react";
import { IconButton, SxProps, Theme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface FloatingLikeButtonProps {
    isLiked?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    sx?: SxProps<Theme>;
    disabled?: boolean;
}

export default function FloatingLikeButton({ isLiked, onClick, sx, disabled }: FloatingLikeButtonProps) {
    const [localLiked, setLocalLiked] = useState<boolean>(!!isLiked);

    useEffect(() => {
        if (isLiked !== undefined) setLocalLiked(isLiked);
    }, [isLiked]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(e);
        }
        if (disabled) return;

        // If uncontrolled (isLiked is undefined), we manage state. 
        // If controlled, the parent should update isLiked, triggering the useEffect above.
        // However, for immediate UI feedback (optimistic), and for PENDING request groups we can toggle locally too, 
        // relying on the parent to eventually set the correct state or this getting overwritten by useEffect.
        setLocalLiked((prev) => !prev);
    };

    return (
        <IconButton
            onClick={handleToggle}
            sx={{
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "grey.100" },
                ...sx,
            }}
        >
            {localLiked ? (
                <FavoriteIcon sx={{ color: "red" }} />
            ) : (
                <FavoriteBorderIcon sx={{ color: "grey.600" }} />
            )}
        </IconButton>
    );
}
