import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";
import { getUserIdBySession } from "@/lib/user";
import { getPaymentProvider } from "@/lib/payments/factory";

async function processJoin(groupId: string, userId: string, req?: Request) {
    if (!req) throw new Error("Request needed to parse JSON body");

    const body = await req.json();
    const { pspToken, pspName } = body;

    if (!pspToken || !pspName) {
        console.error("Commitment payment details required to join active group");
        return NextResponse.json({ error: "שגיאה בהצטרפות לקבוצה" }, { status: 500 });
    }

    const providerRecord = await prisma.paymentServiceProvider.findUnique({
        where: { name: pspName },
    });

    if (!providerRecord) {
        console.error("Payment provider not found");
        return NextResponse.json({ error: "שגיאה בהצטרפות לקבוצה" }, { status: 500 });
    }

    // Transaction to add participant and save the vaulted token
    await prisma.$transaction(async (tx) => {
        await tx.activeGroupParticipant.create({
            data: {
                userId,
                activeGroupId: groupId,
                lastPing: new Date(),
            },
        });

        await tx.paymentToken.create({
            data: {
                userId,
                activeGroupId: groupId,
                pspId: providerRecord.id,
                pspToken,
                agreedFee: parseFloat(process.env.PENALTY_FEE_AMOUNT || "100"),
            },
        });
    });

    return NextResponse.json({ success: true });
}

async function processLeave(groupId: string, userId: string) {
    // Retrieve the Payment Token to charge as penalty
    const tokenRecord = await prisma.paymentToken.findUnique({
        where: { userId_activeGroupId: { userId, activeGroupId: groupId } },
        include: { psp: true },
    });

    // Trigger Penalty Charge if ACTIVE
    if (tokenRecord && tokenRecord.status === "ACTIVE") {
        const provider = getPaymentProvider(tokenRecord.psp.name);
        const chargeResult = await provider.chargeToken(
            tokenRecord.pspToken,
            tokenRecord.agreedFee,
            "ILS"
        );

        if (chargeResult.success) {
            await prisma.paymentToken.update({
                where: { id: tokenRecord.id },
                data: { status: "CONSUMED", consumedAt: new Date() },
            });
        } else {
            console.error("Failed to charge penalty for canceling.", chargeResult.error);
        }
    }

    await prisma.activeGroupParticipant.delete({
        where: {
            userId_activeGroupId: { userId, activeGroupId: groupId },
        },
    });

    return NextResponse.json({ success: true });
}

async function handleMembership(groupId: string, action: "join" | "leave", req?: Request) {
    try {
        const { session, response } = await validateSession();
        if (response) return response;

        if (!groupId) return NextResponse.json({ error: "Group ID is required" }, { status: 400 });

        const userId = await getUserIdBySession(session);

        const activeGroup = await prisma.activeGroup.findUnique({
            where: { id: groupId },
            select: { id: true, status: true },
        });

        if (!activeGroup) return NextResponse.json({ error: "קבוצה לא נמצאה" }, { status: 404 });

        const existingParticipant = await prisma.activeGroupParticipant.findUnique({
            where: {
                userId_activeGroupId: { userId, activeGroupId: groupId },
            },
        });

        if (action === "join") {
            if (existingParticipant) return NextResponse.json({ error: "User is already a participant" }, { status: 400 });
            return await processJoin(groupId, userId, req);
        } else {
            if (!existingParticipant) return NextResponse.json({ error: "User is not a participant" }, { status: 400 });
            return await processLeave(groupId, userId);
        }
    }
    catch (error) {
        console.error(`Membership ${action} error:`, error);
        return NextResponse.json({ error: action === "join" ? "שגיאה בהצטרפות לקבוצה" : "שגיאה בביטול ההרשמה" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(params.id, "join", req);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    return handleMembership(params.id, "leave");
}
