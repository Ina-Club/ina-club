import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { LikeTargetType } from "@prisma/client";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, response } = await validateSession();
  if (response) return response;
  const { id: targetId } = await params;

  try {
    // Check if like already exists
    const existing = await prisma.like.findFirst({
      where: { userId: userId!, targetType: LikeTargetType.WISH_ITEM, targetId },
    });

    if (existing) {
      // Unlike
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: { userId: userId!, targetType: LikeTargetType.WISH_ITEM, targetId },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Failed to toggle wish item like:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
