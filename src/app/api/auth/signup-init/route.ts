import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, name, password, imageUrl } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "שדות חסרים" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    await prisma.pendingProfile.upsert({
      where: { email },
      update: { name, hashedPassword: hashed, imageUrl },
      create: { email, name, hashedPassword: hashed, imageUrl },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}


