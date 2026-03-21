import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { fetchActiveGroups } from "@/lib/groups";
import { aiFilteredGroups } from "@/lib/ai/smart-search";
import { ActiveGroup } from "@/lib/dal";
import { GroupStatus } from "@/lib/types/status";
import { prisma } from "@/lib/prisma";
import { WishItemData } from "@/components/demand-pulse/WishItemCard";

// TODO: Add pagination in the future (if necessary).
export async function POST(req: Request) {
    try {
        const { response } = await validateSession();
        if (response) return response;

        const body = await req.json();
        const { searchText } = body as { searchText: string };
        if (!searchText) return NextResponse.json({ error: "טקסט לחיפוש חובה" }, { status: 400 });

        const activeGroups: ActiveGroup[] = await fetchActiveGroups({ status: GroupStatus.OPEN });
        const rawWishItems = await prisma.wishItem.findMany({
            orderBy: { createdAt: "desc" },
            take: 100, // Reasonable limit
            select: {
                id: true,
                text: true,
                targetPrice: true,
                category: { select: { name: true } },
                createdAt: true,
                createdById: true,
            }
        });
        
        const wishItems: WishItemData[] = rawWishItems.map(item => ({
            id: item.id,
            text: item.text,
            targetPrice: item.targetPrice,
            categoryName: item.category?.name,
            createdAt: item.createdAt.toISOString(),
            authorName: "משתמש",
            authorAvatar: null,
            likeCount: 0,
            isLikedByMe: false
        }));

        const { relevantActiveGroups, relevantWishItems, filtered } = await aiFilteredGroups(activeGroups, wishItems, searchText);

        return NextResponse.json({ activeGroups: relevantActiveGroups, wishItems: relevantWishItems, filtered });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "שגיאה בשליפת נתונים מAI" }, { status: 500 });
    }
}
