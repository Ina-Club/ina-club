import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";
import { validateSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { session, response } = await validateSession();
    if (response) return response;

    const { name, password, imageUrl } = await req.json();
    if (!name || !password) {
      return NextResponse.json({ error: "שדות חסרים" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: session.user!.email! },
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


