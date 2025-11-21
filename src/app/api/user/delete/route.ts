import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

export async function DELETE() {
  try {
    const { session, response } = await validateSession();
    if (response) return response;

    const userEmail = session.user!.email!;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        requestGroupMemberships: true,
        activeGroupMemberships: true,
        requestGroups: true,
        activeGroups: true,
        accounts: true,
        sessions: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    // TODO: Why? foreign keys are supposed to be deleted (cascade)
    // Delete all related data in the correct order to avoid foreign key constraints
    // 1. Delete group memberships
    await prisma.requestGroupParticipant.deleteMany({
      where: { userId: user.id }
    });

    await prisma.activeGroupParticipant.deleteMany({
      where: { userId: user.id }
    });

    // TODO: oh boy, fix this
    // 2. Delete groups owned by the user (this will cascade delete related data)
    await prisma.requestGroup.deleteMany({
      where: { createdById: user.id }
    });

    await prisma.activeGroup.deleteMany({
      where: { createdById: user.id }
    });

    // 3. Delete profile picture if exists
    if (user.profilePictureId) {
      await prisma.image.delete({
        where: { id: user.profilePictureId }
      });
    }

    // 4. Delete NextAuth related data
    await prisma.account.deleteMany({
      where: { userId: user.id }
    });

    await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    // 5. Finally delete the user
    await prisma.user.delete({
      where: { id: user.id }
    });

    return NextResponse.json({ message: "החשבון נמחק בהצלחה" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת החשבון" }, { status: 500 });
  }
}
