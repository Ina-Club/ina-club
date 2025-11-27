import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { fetchActiveGroups, fetchRequestGroups } from "@/lib/groups";
import { aiFilteredGroups } from "@/lib/ai/smart-search";
import { ActiveGroup, RequestGroup } from "@/lib/dal";
import { GroupStatus } from "@/lib/types/status";

// TODO: Add pagination in the future (if necessary).
export async function POST(req: Request) {
    try {
        const { response } = await validateSession();
        if (response) return response;

        const body = await req.json();
        const { searchText } = body as { searchText: string };
        if (!searchText) return NextResponse.json({ error: "טקסט לחיפוש חובה" }, { status: 400 });

        const activeGroups: ActiveGroup[] = await fetchActiveGroups({ status: GroupStatus.OPEN });
        const requestGroups: RequestGroup[] = await fetchRequestGroups({ status: GroupStatus.OPEN });
        const { relevantActiveGroups, relevantRequestGroups, filtered } = await aiFilteredGroups(activeGroups, requestGroups, searchText);
        console.log(relevantActiveGroups, relevantRequestGroups);

        return NextResponse.json({ activeGroups: relevantActiveGroups, requestGroups: relevantRequestGroups, filtered });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "שגיאה בשליפת נתונים מAI" }, { status: 500 });
    }
}
