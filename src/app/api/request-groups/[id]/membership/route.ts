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

        const requestGroup = await prisma.requestGroup.findUnique({
            where: { id },
            select: { id: true, status: true },
        });

        if (!requestGroup) return NextResponse.json({ error: "בקשה לא נמצאה" }, { status: 404 });

        const existingParticipant = await prisma.requestGroupParticipant.findUnique({
            where: {
                userId_requestGroupId: {
                    userId: user.id,
                    requestGroupId: id,
                },
            },
        });

        if (action === "join") {
            if (existingParticipant) return NextResponse.json({ error: "אתה כבר משתתף בבקשה זו" }, { status: 400 });
            await prisma.requestGroupParticipant.create({
                data: {
                    userId: user.id,
                    requestGroupId: id,
                },
            });
        } else {
            if (!existingParticipant) return NextResponse.json({ error: "אינך משתתף בבקשה זו" }, { status: 400 });
            await prisma.requestGroupParticipant.delete({
                where: {
                    userId_requestGroupId: {
                        userId: user.id,
                        requestGroupId: id,
                    },
                },
            });
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error(`Request Group Membership ${action} error:`, error);
        return NextResponse.json({ error: action === "join" ? "שגיאה בהצטרפות לבקשה" : "שגיאה בביטול ההרשמה" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(req, params.id, "join");
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(req, params.id, "leave");
}
