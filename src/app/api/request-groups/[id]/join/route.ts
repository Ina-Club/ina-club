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

    // Check if request group exists
    const requestGroup = await prisma.requestGroup.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!requestGroup) {
      return NextResponse.json({ error: "בקשה לא נמצאה" }, { status: 404 });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.requestGroupParticipant.findUnique({
      where: {
        userId_requestGroupId: {
          userId: user.id,
          requestGroupId: id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ error: "אתה כבר משתתף בבקשה זו" }, { status: 400 });
    }

    // Add user as participant
    await prisma.requestGroupParticipant.create({
      data: {
        userId: user.id,
        requestGroupId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join request group error:", error);
    return NextResponse.json({ error: "שגיאה בהצטרפות לבקשה" }, { status: 500 });
  }
}

