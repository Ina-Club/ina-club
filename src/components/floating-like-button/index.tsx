"use client";

import { IconButton, SxProps, Theme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "@/contexts/favorites-context";
import { ActiveGroup, RequestGroup } from "@/lib/dal";

interface FloatingLikeButtonProps {
    group: RequestGroup | ActiveGroup;
    type: "request-group" | "active-group";
    sx?: SxProps<Theme>;
}

export default function FloatingLikeButton({ group, type, sx }: FloatingLikeButtonProps) {
    const {
        isRequestGroupLiked,
        isActiveGroupLiked,
        toggleRequestGroupLike,
        toggleActiveGroupLike
    } = useFavorites();

    const isLiked = type === "request-group" ? isRequestGroupLiked(group.id) : isActiveGroupLiked(group.id);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (type === "request-group") {
            toggleRequestGroupLike(group as RequestGroup);
        } else {
            toggleActiveGroupLike(group as ActiveGroup);
        }
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
            {isLiked ? (
                <FavoriteIcon sx={{ color: "red" }} />
            ) : (
                <FavoriteBorderIcon sx={{ color: "grey.600" }} />
            )}
        </IconButton>
    );
}
