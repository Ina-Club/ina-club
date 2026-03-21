import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payments/factory";
import { PaymentServiceProvider } from "@/lib/payments/PaymentServiceProvider";

async function chargeUserToken(
    tk: { id: string; userId: string; pspToken: string; agreedFee: number },
    provider: PaymentServiceProvider
) {
    try {
        const res = await provider.chargeToken(tk.pspToken, tk.agreedFee, "ILS");
        if (res.success) {
            await prisma.paymentToken.update({
                where: { id: tk.id },
                data: { status: "CONSUMED", consumedAt: new Date() },
            });
            return { userId: tk.userId, action: "charge", success: true };
        } else {
            console.error(`Charge failed for user ${tk.userId}`);
            return { userId: tk.userId, action: "charge", success: false };
        }
    } catch (err: any) {
        console.error(`Charge failed for user ${tk.userId}: ${err.message}`);
        return { userId: tk.userId, action: "charge", success: false, error: err.message };
    }
}

async function releaseUserToken(
    tk: { id: string; userId: string; pspToken: string },
    provider: PaymentServiceProvider
) {
    try {
        const success = await provider.releaseToken(tk.pspToken);
        if (success) {
            await prisma.paymentToken.update({
                where: { id: tk.id },
                data: { status: "RELEASED" },
            });
            return { userId: tk.userId, action: "release", success: true };
        } else {
            console.error(`Release failed for user ${tk.userId}`);
            return { userId: tk.userId, action: "release", success: false };
        }
    } catch (err: any) {
        console.error(`Release failed for user ${tk.userId}: ${err.message}`);
        return { userId: tk.userId, action: "release", success: false, error: err.message };
    }
}

/**
 * Endpoint for B2B. Receives {"noShowUserIds": ["uuid-1", "uuid-2"]}
 * Charges the no-shows, and detaches/releases tokens for the rest.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { response } = await validateSession();
        if (response) return response;

        const groupId = params.id;
        if (!groupId) return NextResponse.json({ error: "Group ID required" }, { status: 400 });

        const body = await req.json();
        const { noShowUserIds } = body;

        if (!Array.isArray(noShowUserIds)) {
            return NextResponse.json({ error: "noShowUserIds must be an array" }, { status: 400 });
        }

        const tokens = await prisma.paymentToken.findMany({
            where: {
                activeGroupId: groupId,
                status: "ACTIVE",
            },
            include: { psp: true },
        });

        const chargePromises = [];
        const releasePromises = [];

        for (const tk of tokens) {
            const provider = getPaymentProvider(tk.psp.name);

            if (noShowUserIds.includes(tk.userId)) {
                chargePromises.push(chargeUserToken(tk, provider));
            } else {
                releasePromises.push(releaseUserToken(tk, provider));
            }
        }

        const results = await Promise.all([...chargePromises, ...releasePromises]);
        const failures = results.filter((r) => !r.success);

        if (failures.length > 0) {
            return NextResponse.json(
                { success: false, message: "Some tokens failed to process", failures },
                { status: 207 }
            );
        }

        return NextResponse.json({ success: true, message: "Tokens processed successfully." });
    } catch (error) {
        console.error("charge-no-shows error:", error);
        return NextResponse.json({ error: "Failed to process charge for no-shows" }, { status: 500 });
    }
}
