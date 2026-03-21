import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { LikeTargetType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Feed is public, personalization is optional.
    const { userId } = await auth();

    const items = await prisma.wishItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        text: true,
        targetPrice: true,
        category: { select: { name: true } },
        createdAt: true,
        createdById: true,
      },
    });

    // Fetch like counts for all items in one query
    const likeCounts = await prisma.like.groupBy({
      by: ["targetId"],
      where: {
        targetType: LikeTargetType.WISH_ITEM,
        targetId: { in: items.map((i) => i.id) },
      },
      _count: { id: true },
    });

    const likeCountMap = new Map(
      likeCounts.map((l) => [l.targetId, l._count.id])
    );

    // Fetch user's own likes if signed in
    let userLikedSet = new Set<string>();
    if (userId) {
      const userLikes = await prisma.like.findMany({
        where: {
          userId,
          targetType: LikeTargetType.WISH_ITEM,
          targetId: { in: items.map((i) => i.id) },
        },
        select: { targetId: true },
      });
      userLikedSet = new Set(userLikes.map((l) => l.targetId));
    }

    const result = items.map((item) => ({
      id: item.id,
      text: item.text,
      targetPrice: item.targetPrice,
      categoryName: item.category?.name,
      createdAt: item.createdAt,
      authorName: "משתמש",
      authorAvatar: null,
      likeCount: likeCountMap.get(item.id) ?? 0,
      isLikedByMe: userLikedSet.has(item.id),
    }));

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
    const item = await prisma.wishItem.create({
      data: { text, targetPrice, categoryId: body.categoryId || null, createdById: userId },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create wish item:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
