import { NextResponse } from "next/server";
import { getPenaltyFeeAmount } from "@/lib/payments/config";
import { validateSession } from "@/lib/auth";

export async function GET() {
    const { response } = await validateSession();
    if (response) return response;

    const fee = getPenaltyFeeAmount();
    return NextResponse.json({ fee });
}
