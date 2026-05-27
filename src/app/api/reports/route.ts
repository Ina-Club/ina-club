import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { ReportReason, ReportTargetType } from "@/lib/types/report";
import { checkReportQuota } from "@/lib/services/quota";
import { DAILY_REPORT_LIMIT } from "@/app/config/quota";
import { sendReportEmail } from "@/lib/services/email";
import { prisma } from "@/lib/prisma";

const VALID_REASONS = new Set(Object.values(ReportReason));
const VALID_TARGET_TYPES = new Set(Object.values(ReportTargetType));
const MAX_DESCRIPTION_LENGTH = 500;

export async function POST(req: Request) {
    const { userId, response } = await validateSession();
    if (response) return response;

    let body: {
        targetType?: string;
        targetId?: string;
        reason?: string;
        description?: string;
    };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { targetType, targetId, reason, description } = body;

    if (!targetType || !VALID_TARGET_TYPES.has(targetType as ReportTargetType)) {
        return NextResponse.json(
            { error: "Invalid or missing targetType" },
            { status: 400 }
        );
    }

    if (!targetId) {
        return NextResponse.json(
            { error: "targetId is required" },
            { status: 400 }
        );
    }

    if (!reason || !VALID_REASONS.has(reason as ReportReason)) {
        return NextResponse.json(
            { error: "Invalid or missing reason" },
            { status: 400 }
        );
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        return NextResponse.json(
            { error: `description must be ≤${MAX_DESCRIPTION_LENGTH} chars` },
            { status: 400 }
        );
    }

    // Fetch the owner ID based on the target type
    let targetOwnerId: string | null = null;
    let targetTitle: string | undefined;
    
    switch (targetType as ReportTargetType) {
        case ReportTargetType.WISH_ITEM: {
            const item = await prisma.wishItem.findUnique({
                where: { id: targetId },
                select: { createdById: true, text: true }
            });
            if (item) {
                targetOwnerId = item.createdById;
                targetTitle = item.text;
            }
            break;
        }
        // Future target types go here
    }

    if (!targetOwnerId) {
        return NextResponse.json(
            { error: "Reported content not found" },
            { status: 404 }
        );
    }

    // Block self-reports
    if (targetOwnerId === userId) {
        return NextResponse.json(
            { error: "You cannot report your own content" },
            { status: 403 }
        );
    }

    const existingReport = await prisma.report.findFirst({
        where: {
            reporterId: userId,
            targetType: targetType as ReportTargetType,
            targetId,
        },
    });

    if (existingReport) {
        return NextResponse.json(
            { error: "You have already reported this content" },
            { status: 409 }
        );
    }

    const quota = await checkReportQuota(userId, DAILY_REPORT_LIMIT);
    if (!quota.allowed) {
        return NextResponse.json(
            { error: "You have reached the daily report limit", remaining: 0 },
            { status: 429 }
        );
    }

    const report = await prisma.report.create({
        data: {
            reporterId: userId,
            targetType: targetType as ReportTargetType,
            targetId,
            reason: reason as ReportReason,
            description: description?.trim() || null,
        },
    });

    // Sending email without waiting for it.
    sendReportEmail({
        targetType,
        targetId,
        reason,
        description: description?.trim(),
        reporterId: userId,
        targetTitle,
    }).catch((err) => console.error("[report] email send failed:", err));

    const remaining = quota.remaining - 1;
    return NextResponse.json({ id: report.id, remaining }, { status: 201 });
}
