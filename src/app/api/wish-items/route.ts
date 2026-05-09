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

const WISH_ITEM_DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
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
  } catch (error) {
    console.error("Failed to fetch wish items:", error);
    return NextResponse.json([], { status: 500 });
  }
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

  const targetPrice =
    body.targetPrice && body.targetPrice > 0 ? body.targetPrice : null;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;
    const isAdmin = role === "ADMIN";

    let remaining = 999;

    if (!isAdmin) {
      const quota = await checkWishItemQuota(userId, DAILY_WISH_ITEM_LIMIT);

      if (!quota.allowed) {
        return NextResponse.json(
          { error: "You have reached the daily limit of wish items", remaining: 0 },
          { status: 429 }
        );
      }
      
      remaining = quota.remaining - 1; // Since we are creating one now
    }

    const item = await prisma.wishItem.create({
      data: { text, targetPrice, categoryId: body.categoryId || null, createdById: userId },
    });

    return NextResponse.json({ ...item, remaining }, { status: 201 });
  } catch (error) {
    console.error("Failed to create wish item:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
