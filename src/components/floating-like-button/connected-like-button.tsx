"use client";

import { SxProps, Theme } from "@mui/material";
import { ActiveGroup, RequestGroup } from "@/lib/dal";
import { useFavorites } from "@/contexts/favorites-context";
import { GroupStatus } from "@/lib/types/status";
import FloatingLikeButton from "./index";

interface ConnectedLikeButtonProps {
    group: ActiveGroup | RequestGroup;
    type: "request-group" | "active-group";
    sx?: SxProps<Theme>;
}

export default function ConnectedLikeButton({ group, type, sx }: ConnectedLikeButtonProps) {
    const {
        isRequestGroupLiked,
        isActiveGroupLiked,
        toggleRequestGroupLike,
        toggleActiveGroupLike
    } = useFavorites();

    const isLiked = type === "request-group"
        ? isRequestGroupLiked(group.id)
        : isActiveGroupLiked(group.id);

    const handleClick = (e: React.MouseEvent) => {
        if (group.status !== GroupStatus.OPEN) return;

        if (type === "request-group") {
            toggleRequestGroupLike(group as RequestGroup);
        } else {
            toggleActiveGroupLike(group as ActiveGroup);
        }
    };

    return (
        <FloatingLikeButton
            isLiked={isLiked}
            onClick={handleClick}
            sx={sx}
        />
    );
}
