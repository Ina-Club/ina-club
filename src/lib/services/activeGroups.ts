import { prisma } from "lib/prisma";
import { getPaymentProvider } from "@/lib/payments/factory";
import { PaymentTokenStatus } from "@/lib/types/status";

export async function chargeParticipantToken({
    id,
    userId,
    pspToken,
    pspName,
    agreedFee
}: {
    id: string;
    userId: string;
    pspToken: string;
    pspName: string;
    agreedFee: number;
}) {
    const provider = getPaymentProvider(pspName);
    try {
        const res = await provider.chargeToken(pspToken, agreedFee, "ILS");
        if (res.success) {
            await prisma.paymentToken.update({
                where: { id },
                data: { status: PaymentTokenStatus.CONSUMED, consumedAt: new Date() },
            });
            return { userId, action: "charge", success: true };
        } else {
            console.error(`Charge failed for user ${userId}`);
            return { userId, action: "charge", success: false, error: res.error || "Provider charge failed" };
        }
    } catch (err: any) {
        console.error(`Charge failed for user ${userId}: ${err.message}`);
        return { userId, action: "charge", success: false, error: err.message };
    }
}

export async function releaseParticipantToken({
    id,
    userId,
    pspToken,
    pspName
}: {
    id: string;
    userId: string;
    pspToken: string;
    pspName: string;
}) {
    const provider = getPaymentProvider(pspName);
    try {
        const success = await provider.releaseToken(pspToken);
        if (success) {
            await prisma.paymentToken.update({
                where: { id },
                data: { status: PaymentTokenStatus.RELEASED },
            });
            return { userId, action: "release", success: true };
        } else {
            console.error(`Release failed for user ${userId}`);
            return { userId, action: "release", success: false, error: "Provider release failed" };
        }
    } catch (err: any) {
        console.error(`Release failed for user ${userId}: ${err.message}`);
        return { userId, action: "release", success: false, error: err.message };
    }
}
