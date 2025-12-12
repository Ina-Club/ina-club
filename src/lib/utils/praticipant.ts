import { prisma } from "../prisma";

export const checkUserIsRequestGroupParticipant = async (email: string, requestGroupId: string) => {
    const participantId = await prisma.requestGroupParticipant.findFirst({
        where: {
            requestGroupId,
            user: { email },
        },
        select: {
            id: true,
        },
    });
    return !!participantId;
}

export const checkUserIsActiveGroupParticipant = async (email: string, activeGroupId: string) => {
    const participantId = await prisma.activeGroupParticipant.findFirst({
        where: {
            activeGroupId,
            user: { email },
        },
        select: {
            id: true,
        },
    });
    return !!participantId;
}