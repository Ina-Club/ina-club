import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }
    const { name, password, imageUrl } = await req.json();
    if (!name || !password) {
      return NextResponse.json({ error: "שדות חסרים" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        password: hashed,
        profilePicture: imageUrl
          ? {
              upsert: {
                create: { url: imageUrl },
                update: { url: imageUrl },
              },
            }
          : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}


