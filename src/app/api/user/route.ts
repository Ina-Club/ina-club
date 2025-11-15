import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession } from "@/lib/auth";

export async function GET() {
    try {
        const { session, response } = await validateSession();
        if (response) return response;

        const user = await prisma.user.findUnique({
            where: { email: session.user!.email! },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
    }
}
