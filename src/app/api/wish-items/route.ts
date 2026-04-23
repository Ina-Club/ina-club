import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fetchWishItemCards } from "@/lib/wish-items";

export async function GET(req: NextRequest) {
  try {
    // Feed is public, personalization is optional.
    const { userId } = await auth();

    const result = await fetchWishItemCards({
      currentUserId: userId,
      take: 30,
    });

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
