"use client";

import { SxProps, Theme } from "@mui/material";
import { ActiveGroup, } from "@/lib/dal";
import { useFavorites } from "@/contexts/favorites-context";
import { GroupStatus } from "@/lib/types/status";
import FloatingLikeButton from "./index";
import { useAuth } from "@clerk/nextjs";

interface GenericEntityLikeButtonProps {
    entity: ActiveGroup;
    type: "active-group";
    sx?: SxProps<Theme>;
}

export default function GenericEntityLikeButton({ entity, type, sx }: GenericEntityLikeButtonProps) {
    const {
        isActiveGroupLiked,
        toggleActiveGroupLike
    } = useFavorites();
    const isLiked = isActiveGroupLiked(entity.id);

    const { isSignedIn } = useAuth();
    const authenticated: boolean = !!isSignedIn;

    const handleClick = (e: React.MouseEvent) => {
        if (entity.status !== GroupStatus.OPEN) return;

        toggleActiveGroupLike(entity as ActiveGroup);
    };

    return (
        <FloatingLikeButton
            isLiked={isLiked}
            onClick={handleClick}
            sx={sx}
            disabled={!authenticated}
        />
    );
}
