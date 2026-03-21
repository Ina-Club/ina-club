import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";

async function handleMembership(groupId: string, action: "join" | "leave") {
    try {
        const { userId, response } = await validateSession();
        if (response) return response;

        if (!groupId) return NextResponse.json({ error: "Group ID is required" }, { status: 400 });

        const activeGroup = await prisma.activeGroup.findUnique({
            where: { id: groupId },
            select: { id: true, status: true },
        });

        if (!activeGroup) return NextResponse.json({ error: "קבוצה לא נמצאה" }, { status: 404 });

        const existingParticipant = await prisma.activeGroupParticipant.findUnique({
            where: {
                userId_activeGroupId: {
                    userId,
                    activeGroupId: groupId,
                },
            },
        });

        if (action === "join") {
            if (existingParticipant) return NextResponse.json({ error: "User is already a participant" }, { status: 400 });
            await prisma.activeGroupParticipant.create({
                data: {
                    userId,
                    activeGroupId: groupId,
                    lastPing: new Date(),
                },
            });
        } else {
            if (!existingParticipant) return NextResponse.json({ error: "User is not a participant" }, { status: 400 });
            await prisma.activeGroupParticipant.delete({
                where: {
                    userId_activeGroupId: {
                        userId,
                        activeGroupId: groupId,
                    },
                },
            });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error(`Membership ${action} error:`, error);
        return NextResponse.json({ error: action === "join" ? "שגיאה בהצטרפות לקבוצה" : "שגיאה בביטול ההרשמה" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return handleMembership(id, "join");
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return handleMembership(id, "leave");
}
