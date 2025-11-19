import { UnauthorizedError } from "errors/UnauthorizedError";
import { prisma } from "./prisma";
import { UserNotFoundError } from "errors/UserNotFoundError";
import { Session } from "next-auth";

export const getUserIdBySession = async (session: Session) => {
    if (!session?.user?.email) throw new UnauthorizedError();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });
    if (!user) throw new UserNotFoundError();

    return user.id;
}
