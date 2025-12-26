import { ActiveGroup, RequestGroup } from "./dal";
import { prisma } from "./prisma";

export const fetchRequestGroups = async (whereData: object) => {
    const where: any = { ...whereData };
    const rows = await prisma.requestGroup.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            category: { select: { name: true } },
            participants: {
                //TODO: Fetch length instead
                select: {
                    user: {
                        select: {
                            // id: true,
                            name: true,
                            // email: true,
                            profilePicture: { select: { url: true } },
                        },
                    },
                },
            },
            images: {
                select: { image: { select: { url: true } }, order: true },
                orderBy: { order: "asc" },
            },
            activeGroups: { select: { id: true } },
        },
        where
    });

    const data = rows.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        category: r.category?.name ?? "",
        images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
        participants: r.participants.map((p) => ({
            // id: p.user.id,
            firstName: p.user.name ? p.user.name.split(" ")[0] : "",
            image: p.user.profilePicture?.url ?? "",
            // mail: p.user.email,
        })),
        // TODO: Remove
        // openedGroups: r.activeGroups.map((ag) => ({ id: ag.id })),
    }));

    return data as RequestGroup[];
}

export const fetchActiveGroups = async (whereData: object) => {
    const where: any = { ...whereData };
    const rows = await prisma.activeGroup.findMany({
        select: {
            id: true,
            title: true,
            status: true,
            category: { select: { name: true } },
            basePrice: true,
            groupPrice: true,
            deadline: true,
            participants: { //TODO: Fetch length instead
                select: {
                    user: {
                        select: {
                            // id: true,
                            name: true,
                            // email: true,
                            profilePicture: { select: { url: true } },
                        },
                    },
                },
            },
            minParticipants: true,
            maxParticipants: true,
            images: {
                select: { image: { select: { url: true } }, order: true },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
        where
    });

    const data = rows.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        category: r.category?.name ?? "",
        basePrice: r.basePrice,
        groupPrice: r.groupPrice,
        deadline: r.deadline,
        images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
        participants: r.participants.map((p) => ({
            // id: p.user.id,
            firstName: p.user.name ? p.user.name.split(" ")[0] : "",
            image: p.user.profilePicture?.url ?? "",
            // mail: p.user.email,
        })),
        minParticipants: r.minParticipants,
        maxParticipants: r.maxParticipants
    }));

    return data as ActiveGroup[];
}

export const filterGroupsByIds = (groups: RequestGroup[] | ActiveGroup[], groupIds: string[]) => {
    const groupIdsSet: Set<string> = new Set(groupIds);
    return groups.filter((g) => groupIdsSet.has(g.id));
}