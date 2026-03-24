import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";
import { getPenaltyFeeAmount } from "@/lib/payments/config";
import { PaymentTokenStatus } from "@/lib/types/status";
import { chargeParticipantToken } from "@/lib/services/activeGroups";
import { createGroupCoupon } from "@/lib/services/coupon";

async function commitJoinTransaction(
    groupId: string,
    userId: string,
    pspId: string,
    pspToken: string,
) {
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
                pspId,
                pspToken,
                agreedFee: getPenaltyFeeAmount(),
            },
        });
    });
}

async function processJoin(groupId: string, userId: string, groupDeadline: Date, req: Request) {
    const body = await req.json();
    const { cardNumber, expiry, cvv } = body;

    // In a real application, you'd never send raw CC to your own server (PCI DSS).
    if (!cardNumber || !expiry || !cvv) {
        console.error("Commitment payment details required to join active group");
        return NextResponse.json({ error: "שגיאה בהצטרפות לקבוצה" }, { status: 500 });
    }

    // Since this is an MVP mock, we generate the mock token here
    // instead of expecting the frontend to know about the PSP.
    const pspName = "MOCK_PSP";
    const pspToken = `tok_test_${Math.random().toString(36).substring(7)}`;

    const providerRecord = await prisma.paymentServiceProvider.findUnique({
        where: { name: pspName },
    });

    if (!providerRecord) {
        console.error("Payment provider not found");
        return NextResponse.json({ error: "שגיאה בהצטרפות לקבוצה" }, { status: 500 });
    }

    await commitJoinTransaction(groupId, userId, providerRecord.id, pspToken);
    const coupon = await createGroupCoupon(userId, groupId, groupDeadline);

    return NextResponse.json({ success: true, coupon });
}

async function processLeave(groupId: string, userId: string) {
    // Retrieve the Payment Token to charge as penalty
    const tokenRecord = await prisma.paymentToken.findFirst({
        where: { userId, activeGroupId: groupId, status: PaymentTokenStatus.ACTIVE },
        orderBy: { createdAt: "desc" },
        include: { psp: true },
    });

    // Trigger Penalty Charge if ACTIVE
    if (tokenRecord && tokenRecord.status === PaymentTokenStatus.ACTIVE) {
        const chargeResult = await chargeParticipantToken({
            id: tokenRecord.id,
            userId: tokenRecord.userId,
            pspToken: tokenRecord.pspToken,
            pspName: tokenRecord.psp.name,
            agreedFee: tokenRecord.agreedFee,
            currency: tokenRecord.currency
        });

        if (!chargeResult.success) {
            console.error("Failed to charge penalty for canceling.", chargeResult.error);
            return NextResponse.json({ error: "שגיאה בביטול ההרשמה" }, { status: 500 });
        }
    }

    await prisma.activeGroupParticipant.delete({
        where: {
            userId_activeGroupId: { userId, activeGroupId: groupId },
        },
    });
    await prisma.coupon.deleteMany({
        where: {
            userId,
            groupId,
        }
    })

    return NextResponse.json({ success: true });
}

async function handleMembership(groupId: string, action: "join" | "leave", req?: Request) {
    try {
        const { userId, response } = await validateSession();
        if (response) return response;

        if (!groupId) return NextResponse.json({ error: "Group ID is required" }, { status: 400 });

        const activeGroup = await prisma.activeGroup.findUnique({
            where: { id: groupId },
            select: { id: true, status: true, deadline: true },
        });

        if (!activeGroup) return NextResponse.json({ error: "קבוצה לא נמצאה" }, { status: 404 });

        const existingParticipant = await prisma.activeGroupParticipant.findUnique({
            where: {
                userId_activeGroupId: { userId, activeGroupId: groupId },
            },
        });

        if (action === "join") {
            if (existingParticipant) return NextResponse.json({ error: "User is already a participant" }, { status: 400 });
            if (!req) return NextResponse.json({ error: "Request needed to parse JSON body" }, { status: 400 });
            return await processJoin(groupId, userId, activeGroup.deadline, req);
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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return handleMembership(id, "join", req);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return handleMembership(id, "leave");
}
