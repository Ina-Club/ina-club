import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

export async function DELETE() {
  try {
    const { userId, response } = await validateSession();
    if (response) return response;

    // Delete all related data in the correct order to avoid foreign key constraints
    // (Note: Clerk user ID is used as the key in our DB)

    // 1. Delete group memberships
    await prisma.activeGroupParticipant.deleteMany({
      where: { userId }
    });

    // 2. Delete groups owned by the user
    await prisma.activeGroup.deleteMany({
      where: { createdById: userId }
    });

    // 3. Delete likes
    await prisma.like.deleteMany({
      where: { userId }
    });

    // 4. Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return NextResponse.json({ message: "החשבון נמחק בהצלחה" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת החשבון" }, { status: 500 });
  }
}
