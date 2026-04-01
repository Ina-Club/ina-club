import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";
import { PaymentTokenStatus, GroupStatus } from "@/lib/types/status";
import { chargeParticipantToken, releaseParticipantToken } from "@/lib/services/activeGroups";


/**
 * Endpoint for B2B. Receives {"noShowUserIds": ["uuid-1", "uuid-2"]}
 * Charges the no-shows, and detaches/releases tokens for the rest.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { response } = await validateSession();
        if (response) return response;

        const { id: groupId } = await params;
        if (!groupId) return NextResponse.json({ error: "Group ID required" }, { status: 400 });

        const body = await req.json();
        const { noShowUserIds } = body;

        if (!Array.isArray(noShowUserIds)) {
            return NextResponse.json({ error: "noShowUserIds must be an array" }, { status: 400 });
        }

        const tokens = await prisma.paymentToken.findMany({
            where: {
                activeGroupId: groupId,
                status: PaymentTokenStatus.ACTIVE,
            },
            include: { psp: true },
        });

        const chargePromises = [];
        const releasePromises = [];

        for (const tk of tokens) {
            if (noShowUserIds.includes(tk.userId)) {
                chargePromises.push(chargeParticipantToken({
                    id: tk.id,
                    userId: tk.userId,
                    pspToken: tk.pspToken,
                    pspName: tk.psp.name,
                    agreedFee: tk.agreedFee,
                    currency: tk.currency
                }));
            } else {
                releasePromises.push(releaseParticipantToken({
                    id: tk.id,
                    userId: tk.userId,
                    pspToken: tk.pspToken,
                    pspName: tk.psp.name
                }));
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

        await prisma.activeGroup.update({
            where: { id: groupId },
            data: { status: GroupStatus.RESOLVED }
        });

        return NextResponse.json({ success: true, message: "Tokens processed successfully." });
    } catch (error) {
        console.error("resolve-tokens error:", error);
        return NextResponse.json({ error: "Failed to process charge for no-shows" }, { status: 500 });
    }
}
