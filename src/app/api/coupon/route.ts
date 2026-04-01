import { validateSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createGroupCoupon } from "@/lib/services/coupon";

export async function POST(req: Request) {
  try {
    const { userId, response } = await validateSession();
    if (response) return response;

    const { groupId } = await req.json();
    if (!groupId) return NextResponse.json({ error: "groupId is required" }, { status: 400 });

    const group = await prisma.activeGroup.findUnique({ where: { id: groupId }, select: { id: true, deadline: true } });
    if (!group) return NextResponse.json({ error: "Group not found!" }, { status: 404 });

    const participant = await prisma.activeGroupParticipant.findUnique({
      where: { userId_activeGroupId: { userId, activeGroupId: groupId } },
    });
    if (!participant) {
      return NextResponse.json({ error: "Cannot create coupon for non-member user" }, { status: 403 });
    }

    const existingCoupon = await prisma.coupon.findFirst({ where: { userId, groupId } });
    if (existingCoupon)
      return NextResponse.json({ error: "Coupon for this user already exists!" }, { status: 409 });

    const coupon = await createGroupCoupon(userId, groupId, group.deadline);
    return NextResponse.json(coupon, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error creating coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { response } = await validateSession();
    if (response) return response;

    const { couponId } = await req.json();
    if (!couponId) return NextResponse.json({ error: "couponId is required" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) return NextResponse.json({ error: "Coupon not found!" }, { status: 404 });
    // TODO: Add admin validation for deleting coupons

    await prisma.coupon.delete({ where: { id: couponId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error deleting coupon" }, { status: 500 });
  }
}
