import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { fetchActiveGroups } from "@/lib/groups";
import { aiFilteredGroups } from "@/lib/ai/smart-search";
import { ActiveGroup } from "@/lib/dal";
import { GroupStatus } from "@/lib/types/status";
import { prisma } from "@/lib/prisma";
import { WishItemData } from "@/components/demand-pulse/WishItemCard";
import { getClerkPublicUsersMap } from "@/lib/clerk-users";
import { DAILY_SMART_SEARCH_LIMIT } from "@/app/config/quota";

// TODO: Add pagination in the future (if necessary).
export async function POST(req: Request) {
    try {
        const { response, userId } = await validateSession();
        if (response) return response;

        const body = await req.json();
        const { searchText } = body as { searchText: string };
        if (!searchText) return NextResponse.json({ error: "טקסט לחיפוש חובה" }, { status: 400 });

        const now = new Date();
        const startOfTodayForSmartSearch = new Date();
        startOfTodayForSmartSearch.setHours(0, 0, 0, 0);

        const activity = await prisma.userActivity.findUnique({ where: { userId } });
        let currentSmartCount = 0;
        if (activity?.lastSmartSearchDate && activity.lastSmartSearchDate >= startOfTodayForSmartSearch) {
            currentSmartCount = activity.smartSearchCount || 0;
        }

        if (currentSmartCount >= DAILY_SMART_SEARCH_LIMIT) {
            return NextResponse.json(
                { error: "הגעת למכסה היומית של החיפוש החכם. נסה שוב מחר." },
                { status: 429 }
            );
        }

        // Increment quota count
        await prisma.userActivity.upsert({
            where: { userId },
            create: { userId, lastSmartSearchDate: now, smartSearchCount: 1 },
            update: { lastSmartSearchDate: now, smartSearchCount: currentSmartCount + 1 },
        });

        const activeGroups: ActiveGroup[] = await fetchActiveGroups({ whereData: { status: GroupStatus.OPEN } });
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

        const authorsMap = await getClerkPublicUsersMap(rawWishItems.map((item) => item.createdById));
        
        const wishItems: WishItemData[] = rawWishItems.map(item => ({
            id: item.id,
            text: item.text,
            targetPrice: item.targetPrice,
            categoryName: item.category?.name,
            createdAt: item.createdAt.toISOString(),
            authorName: authorsMap.get(item.createdById)?.name ?? "משתמש",
            authorAvatar: authorsMap.get(item.createdById)?.imageUrl ?? null,
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
