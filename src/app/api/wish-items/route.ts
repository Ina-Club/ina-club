import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { fetchWishItemCards } from "@/lib/wish-items";
import { MAX_PAGINATION_LIMIT } from "@/app/config/pagination";
import { clerkClient } from "@clerk/nextjs/server";
import { checkWishItemQuota } from "@/lib/services/quota";
import { DAILY_WISH_ITEM_LIMIT } from "@/app/config/quota";
import { RoleLevel } from "@/lib/types/role";
import { prisma } from "@/lib/prisma";
import { moderateContent } from "@/lib/services/ai-moderation";

const WISH_ITEM_DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  // Feed is public, personalization is optional.
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);

  // Server-side cap prevents abuse regardless of client input
  const take = Math.min(
    Number(searchParams.get("limit")) || WISH_ITEM_DEFAULT_TAKE,
    MAX_PAGINATION_LIMIT
  );

  // Optional: only items created after this ISO date
  const sinceParam = searchParams.get("since");
  const where: Record<string, unknown> = {};
  if (sinceParam) {
    const sinceDate = new Date(sinceParam);
    if (!isNaN(sinceDate.getTime())) {
      where.createdAt = { gte: sinceDate };
    }
  }

  const orderByParam = searchParams.get("orderBy");

  const result = await fetchWishItemCards({
    currentUserId: userId,
    take,
    where,
  });

  // TODO: Implement DB level sort for likes when reaching scale issues.
  // (likes live in a separate polymorphic table, so Prisma can't sort by them)
  if (orderByParam === "likes") {
    result.sort((a, b) => b.likeCount - a.likeCount);
  }

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { userId, response } = await validateSession();
  if (response) return response;

  let body: { text?: string; targetPrice?: number; categoryId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text || text.length > 200) {
    return NextResponse.json(
      { error: "text is required and must be ≤200 chars" },
      { status: 400 }
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata?.role;
  const isAdmin = role === "ADMIN";

  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  oneWeekFromNow.setHours(0, 0, 0, 0);

  if (!isAdmin) {
    // 1. Check violation block first
    const activity = await prisma.userActivity.findUnique({ where: { userId } });
    if (activity?.wishItemBlockedUntil && activity.wishItemBlockedUntil > now) {
      return NextResponse.json(
        { error: "אתה חסום מיצירת בקשות עקב הפרת תנאי השימוש. תוכל להגיש בקשה מחדש לאחר שתסתיים החסימה.", blocked: true },
        { status: 403 }
      );
    }

    // 2. Check daily quota
    const quota = await checkWishItemQuota(userId, DAILY_WISH_ITEM_LIMIT);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "הגעת למגבלת הבקשות היומית. תוכל להגיש בקשה חדשה מחר.", quotaReached: true },
        { status: 429 }
      );
    }

    // 3. AI moderation
    const moderation = await moderateContent(text);
    if (!moderation.isValid) {
      // Block the user for a week
      await prisma.userActivity.upsert({
        where: { userId },
        create: { userId, wishItemBlockedUntil: oneWeekFromNow },
        update: { wishItemBlockedUntil: oneWeekFromNow },
      });
      return NextResponse.json(
        { 
          error: "הבקשה נדחתה עקב תוכן לא מתאים.", 
          reason: moderation.reason || "תוכן לא מתאים",
          blocked: true,
          violation: true 
        },
        { status: 422 }
      );
    }
  }

  // 4. Check for duplicate
  const existingItem = await prisma.wishItem.findFirst({
    where: {
      text: {
        equals: text,
        mode: "insensitive",
      },
    },
  });

  if (existingItem) {
    return NextResponse.json(
      { error: "A wish item with this description already exists." },
      { status: 409 }
    );
  }

  const targetPrice =
    body.targetPrice && body.targetPrice > 0 ? body.targetPrice : null;

  // 5. Create the wish item
  const item = await prisma.wishItem.create({
    data: { text, targetPrice, categoryId: body.categoryId || null, createdById: userId },
  });

  // 6. Record the usage in UserActivity
  if (!isAdmin) {
    await prisma.userActivity.upsert({
      where: { userId },
      create: { userId, lastWishItemDate: now },
      update: { lastWishItemDate: now },
    });
  }

  return NextResponse.json({ ...item, remaining: 0 }, { status: 201 });
}
