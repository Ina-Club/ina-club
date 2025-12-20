import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";

async function handleMembership(req: Request, id: string, action: "join" | "leave") {
    try {
        const { session, response } = await validateSession();
        if (response) return response;

        if (!id) return NextResponse.json({ error: "Group ID is required" }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { email: session.user!.email! },
            select: { id: true },
        });

        if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });

        const activeGroup = await prisma.activeGroup.findUnique({
            where: { id },
            select: { id: true, status: true },
        });

        if (!activeGroup) return NextResponse.json({ error: "קבוצה לא נמצאה" }, { status: 404 });

        const existingParticipant = await prisma.activeGroupParticipant.findUnique({
            where: {
                userId_activeGroupId: {
                    userId: user.id,
                    activeGroupId: id,
                },
            },
        });

        if (action === "join") {
            if (existingParticipant) return NextResponse.json({ error: "User is already a participant" }, { status: 400 });
            await prisma.activeGroupParticipant.create({
                data: {
                    userId: user.id,
                    activeGroupId: id,
                    lastPing: new Date(),
                },
            });
        } else {
            if (!existingParticipant) return NextResponse.json({ error: "User is not a participant" }, { status: 400 });
            await prisma.activeGroupParticipant.delete({
                where: {
                    userId_activeGroupId: {
                        userId: user.id,
                        activeGroupId: id,
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(req, params.id, "join");
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(req, params.id, "leave");
}
