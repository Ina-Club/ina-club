import { prisma } from "../prisma";

export const checkUserIsActiveGroupParticipant = async (userId: string, activeGroupId: string) => {
    const participantId = await prisma.activeGroupParticipant.findFirst({
        where: {
            activeGroupId,
            userId,
        },
        select: {
            id: true,
        },
    });
    return !!participantId;
}