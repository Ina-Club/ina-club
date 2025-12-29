import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LikeTargetType } from "@/lib/types/like";
import { getUserIdBySession } from "@/lib/user";
import { validateSession } from "@/lib/auth";

// export async function GET(
//     request: Request,
//     { params }: { params: { targetType: string; targetId: string } }
// ) {
//     const { targetType: typeParam, targetId } = params;
//     let targetType: LikeTargetType;

//     if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
//     else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
//     else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

//     try {
//         const likes = await prisma.like.findMany({
//             select: { id: true },
//             where: { targetType, targetId },
//         });
//         return NextResponse.json({ likes: likes.length });
//     } catch (error: any) {
//         console.error("Failed to get likes:", error);
//         return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//     }
// }

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
    else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    try {
        // Idempotent - this ensures like exists and eliminates multiple upserts attempting to create the same like
        await prisma.like.create({
            data: { userId, targetType, targetId },
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
    { params }: { params: { targetType: string; targetId: string } }
) {
    const { session, response } = await validateSession();
    if (response) return response;

    const userId = await getUserIdBySession(session);

    const { targetType: typeParam, targetId } = params;
    let targetType: LikeTargetType;

    if (typeParam === "request-groups") targetType = LikeTargetType.REQUEST_GROUP;
    else if (typeParam === "active-groups") targetType = LikeTargetType.ACTIVE_GROUP;
    else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    try {
        // Idempotent delete
        await prisma.like.deleteMany({
            where: {
                userId,
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
