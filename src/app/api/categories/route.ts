import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשליפת קטגוריות" }, { status: 500 });
  }
}
