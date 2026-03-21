import { ActiveGroup } from "./dal";
import { prisma } from "./prisma";
import { LikeTargetType } from "./types/like";
import { getClerkPublicUsersMap } from "./clerk-users";

export const fetchActiveGroups = async (whereData: object, take?: number) => {
    const where: any = { ...whereData };
    const rows = await prisma.activeGroup.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            description: true,
            category: { select: { name: true } },
            basePrice: true,
            groupPrice: true,
            deadline: true,
            participants: {
                select: {
                    userId: true,
                },
            },
            minParticipants: true,
            maxParticipants: true,
            registrationTerms: true,
            images: {
                select: { image: { select: { url: true } }, order: true },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
        where,
        take
    });

    const allParticipantIds = rows.flatMap((row) => row.participants.map((p) => p.userId));
    const usersMap = await getClerkPublicUsersMap(allParticipantIds);

    const data = rows.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        description: r.description,
        category: r.category?.name ?? "",
        basePrice: r.basePrice,
        groupPrice: r.groupPrice,
        deadline: r.deadline,
        images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
        participants: r.participants.map((p) => ({
            firstName: usersMap.get(p.userId)?.name.split(" ")[0] ?? "משתמש",
            image: usersMap.get(p.userId)?.imageUrl ?? "",
        })),
        minParticipants: r.minParticipants,
        maxParticipants: r.maxParticipants,
        registrationTerms: r.registrationTerms,
    }));

    return data as ActiveGroup[];
}

export const filterGroupsByIds = (groups: ActiveGroup[], groupIds: string[]) => {
    const groupIdsSet: Set<string> = new Set(groupIds);
    return groups.filter((g) => groupIdsSet.has(g.id));
}

export const fetchGroupLikeCount = async (targetId: string, targetType: LikeTargetType) => {
    const count = await prisma.like.count({
        where: {
            targetType,
            targetId,
        },
    });
    return count;
}