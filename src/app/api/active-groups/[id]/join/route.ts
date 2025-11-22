import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    const { id } = params;

    // Check if active group exists
    const activeGroup = await prisma.activeGroup.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!activeGroup) {
      return NextResponse.json({ error: "קבוצה לא נמצאה" }, { status: 404 });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.activeGroupParticipant.findUnique({
      where: {
        userId_activeGroupId: {
          userId: user.id,
          activeGroupId: id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ error: "אתה כבר משתתף בקבוצה זו" }, { status: 400 });
    }

    // Add user as participant
    await prisma.activeGroupParticipant.create({
      data: {
        userId: user.id,
        activeGroupId: id,
        lastPing: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join active group error:", error);
    return NextResponse.json({ error: "שגיאה בהצטרפות לקבוצה" }, { status: 500 });
  }
}

