import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchActiveGroups } from "@/lib/groups";
import { validateSession } from "@/lib/auth";
import { LikeTargetType } from "@/lib/types/like";

export async function GET() {
    const { userId, response } = await validateSession();
    if (response) return response;

    try {
        const likes = await prisma.like.findMany({
            where: { userId },
        });

        const activeGroupIds = likes
            .filter((l) => l.targetType === LikeTargetType.ACTIVE_GROUP)
            .map((l) => l.targetId);

        const wishItemIds = likes
            .filter((l) => l.targetType === LikeTargetType.WISH_ITEM)
            .map((l) => l.targetId);

        const [activeGroups, wishItems] = await Promise.all([
            fetchActiveGroups({ id: { in: activeGroupIds } }),
            prisma.wishItem.findMany({
                where: { id: { in: wishItemIds } },
                include: {
                    category: { select: { name: true } },
                },
            }),
        ]);

        // Format wish items to match the expected structure
        const formattedWishes = wishItems.map(item => ({
            id: item.id,
            text: item.text,
            targetPrice: item.targetPrice,
            categoryName: item.category?.name,
            authorName: "משתמש",
            authorAvatar: null,
            isLikedByMe: true,
        }));

        return NextResponse.json({ activeGroups, wishItems: formattedWishes });
    } catch (error) {
        console.error("Failed to fetch likes:", error);
        return NextResponse.json({ activeGroups: [], wishItems: [] }, { status: 500 });
    }
}
