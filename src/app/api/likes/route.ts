import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchActiveGroups, fetchRequestGroups } from "@/lib/groups";
import { validateSession } from "@/lib/auth";
import { LikeTargetType } from "@/lib/types/like";
import { getUserIdBySession } from "@/lib/user";

export async function GET() {
    const { session, response } = await validateSession();
    if (response) return response;

    const userId = await getUserIdBySession(session);

    try {
        const likes = await prisma.like.findMany({
            where: { userId },
        });

        const requestGroupIds = likes
            .filter((l) => l.targetType === LikeTargetType.REQUEST_GROUP)
            .map((l) => l.targetId);

        const activeGroupIds = likes
            .filter((l) => l.targetType === LikeTargetType.ACTIVE_GROUP)
            .map((l) => l.targetId);

        const [requestGroups, activeGroups] = await Promise.all([
            fetchRequestGroups({ id: { in: requestGroupIds } }),
            fetchActiveGroups({ id: { in: activeGroupIds } }),
        ]);

        return NextResponse.json({ requestGroups, activeGroups });
    } catch (error) {
        console.error("Failed to fetch likes:", error);
        return NextResponse.json({ requestGroups: [], activeGroups: [] }, { status: 500 });
    }
}
