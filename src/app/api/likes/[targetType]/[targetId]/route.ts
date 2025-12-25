import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LikeTargetType } from "@/lib/types/like";

export async function PUT(
    request: Request,
    { params }: { params: { targetType: string; targetId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { targetType: typeParam, targetId } = await params;
    let targetType: LikeTargetType;

    if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
    else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else return new NextResponse("Invalid type", { status: 400 });

    try {
        // Idempotent upsert
        await prisma.like.upsert({
            where: {
                userId_targetType_targetId: {
                    userId: user.id,
                    targetType,
                    targetId,
                },
            },
            create: {
                userId: user.id,
                targetType,
                targetId,
            },
            update: {},
        });
        return new NextResponse("OK");
    } catch (error) {
        console.error("Failed to add like:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { targetType: string; targetId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { targetType: typeParam, targetId } = await params;
    let targetType: LikeTargetType;

    if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
    else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else return new NextResponse("Invalid type", { status: 400 });

    try {
        // Idempotent delete
        await prisma.like.deleteMany({
            where: {
                userId: user.id,
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
