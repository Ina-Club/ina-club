import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LikeTargetType } from "@/lib/types/like";
import { getUserIdBySession } from "@/lib/user";
import { validateSession } from "@/lib/auth";

export async function PUT(
    request: Request,
    { params }: { params: { targetType: string; targetId: string } }
) {
    const { session, response } = await validateSession();
    if (response) return response;

    const userId = await getUserIdBySession(session);

    const { targetType: typeParam, targetId } = params;
    let targetType: LikeTargetType;

    if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
    else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else return new NextResponse("Invalid type", { status: 400 });

    try {
        // Idempotent
        await prisma.like.create({
            data: { userId, targetType, targetId },
        });
        return new NextResponse("OK");
    } catch (error: any) {
        if (error.code === "P2002") {
            // Already liked — success
            return new NextResponse("OK");
        }
        console.error("Failed to add like:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { targetType: string; targetId: string } }
) {
    const { session, response } = await validateSession();
    if (response) return response;

    const userId = await getUserIdBySession(session);

    const { targetType: typeParam, targetId } = params;
    let targetType: LikeTargetType;

    if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
    else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else return new NextResponse("Invalid type", { status: 400 });

    try {
        // Idempotent delete
        await prisma.like.deleteMany({
            where: {
                userId,
                targetType,
                targetId,
            },
        });
        return new NextResponse("OK");
    } catch (error) {
        console.error("Failed to remove like:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
