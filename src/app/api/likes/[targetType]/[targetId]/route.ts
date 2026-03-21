import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LikeTargetType } from "@/lib/types/like";
import { validateSession } from "@/lib/auth";


export async function PUT(
    request: Request,
    { params }: { params: Promise<{ targetType: string; targetId: string }> }
) {
    const { userId, response } = await validateSession();
    if (response) return response;

    const { targetType: typeParam, targetId } = await params;
    let targetType: LikeTargetType;

    if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else if (typeParam === "wish-items") targetType = LikeTargetType.WISH_ITEM;
    else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    try {
        await prisma.like.create({
            data: { userId: userId!, targetType, targetId },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ success: true }, { status: 200 });
        }
        console.error("Failed to add like:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ targetType: string; targetId: string }> }
) {
    const { userId, response } = await validateSession();
    if (response) return response;

    const { targetType: typeParam, targetId } = await params;
    let targetType: LikeTargetType;

    if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else if (typeParam === "wish-items") targetType = LikeTargetType.WISH_ITEM;
    else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    try {
        await prisma.like.deleteMany({
            where: {
                userId: userId!,
                targetType,
                targetId,
            },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to remove like:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
