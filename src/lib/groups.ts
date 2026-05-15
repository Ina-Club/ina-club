import { ActiveGroup } from "./dal";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { LikeTargetType } from "./types/like";
import { getClerkPublicUsersMap } from "./clerk-users";

interface FetchActiveGroupsOptions {
    whereData?: Prisma.ActiveGroupWhereInput;
    take?: number;
    cursor?: Prisma.ActiveGroupWhereUniqueInput;
    orderBy?: Prisma.ActiveGroupOrderByWithRelationInput;
    includeDetails?: boolean;
}

export const fetchActiveGroups = async ({
    whereData = {},
    take,
    cursor,
    orderBy = { createdAt: "desc" },
    includeDetails = false
}: FetchActiveGroupsOptions = {}) => {
    const where = { ...whereData };
    const rows = await prisma.activeGroup.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            ...(includeDetails && { description: true }),
            category: { select: { name: true } },
            basePrice: true,
            groupPrice: true,
            deadline: true,
            _count: { select: { participants: true } },
            minParticipants: true,
            maxParticipants: true,
            ...(includeDetails && { registrationTerms: true }),
            images: {
                select: { image: { select: { url: true } }, order: true },
                orderBy: { order: "asc" },
            },
        },
        orderBy,
        where,
        take,
        ...(cursor && { cursor }),
    });

    const data = rows.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        ...(includeDetails && { description: r.description }),
        category: r.category?.name ?? "",
        basePrice: r.basePrice,
        groupPrice: r.groupPrice,
        deadline: r.deadline,
        images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
        participantCount: r._count.participants,
        minParticipants: r.minParticipants,
        maxParticipants: r.maxParticipants,
        ...(includeDetails && { registrationTerms: r.registrationTerms }),
    }));

    return data as ActiveGroup[];
}

export const fetchGroupParticipants = async (groupId: string) => {
    const rows = await prisma.activeGroupParticipant.findMany({
        where: { activeGroupId: groupId },
        select: { userId: true },
    });

    const userIds = rows.map((r) => r.userId);
    const usersMap = await getClerkPublicUsersMap(userIds);

    return userIds.map((id) => ({
        firstName: usersMap.get(id)?.name.split(" ")[0] ?? "משתמש",
        image: usersMap.get(id)?.imageUrl ?? "",
    }));
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
