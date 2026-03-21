import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function validateSession() {
    const { userId } = await auth();
    if (!userId) {
        return {
            userId: null,
            response: NextResponse.json({ error: "לא מורשה" }, { status: 401 }),
        };
    }
    return { userId, response: null };
}

export async function getClerkUser() {
    const user = await currentUser();
    if (!user) return null;
    return user;
}

export async function getCurrentUser() {
    return getClerkUser();
}
