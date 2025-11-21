import { getServerSession } from "next-auth";
import { authOptions } from "../../src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function validateSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return {
            session: null,
            response: NextResponse.json({ error: "לא מורשה" }, { status: 401 }),
        };
    }
    return { session, response: null };
}
