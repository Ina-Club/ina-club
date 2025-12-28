"use client";

import { SxProps, Theme } from "@mui/material";
import { ActiveGroup, RequestGroup } from "@/lib/dal";
import { useFavorites } from "@/contexts/favorites-context";
import { GroupStatus } from "@/lib/types/status";
import FloatingLikeButton from "./index";

interface GenericEntityLikeButtonProps {
    entity: ActiveGroup | RequestGroup;
    type: "request-group" | "active-group";
    sx?: SxProps<Theme>;
}

export default function GenericEntityLikeButton({ entity, type, sx }: GenericEntityLikeButtonProps) {
    const {
        isRequestGroupLiked,
        isActiveGroupLiked,
        toggleRequestGroupLike,
        toggleActiveGroupLike
    } = useFavorites();

    const isLiked = type === "request-group"
        ? isRequestGroupLiked(entity.id)
        : isActiveGroupLiked(entity.id);

    const handleClick = (e: React.MouseEvent) => {
        if (entity.status !== GroupStatus.OPEN) return;

        if (type === "request-group") {
            toggleRequestGroupLike(entity as RequestGroup);
        } else {
            toggleActiveGroupLike(entity as ActiveGroup);
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
