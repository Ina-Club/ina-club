import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { sendRequestToAi } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { response } = await validateSession();
    if (response) return response;

    const { prompt, schema } = await req.json();
    const aiResponse: string | undefined = await sendRequestToAi(prompt, schema);
    return new NextResponse(aiResponse);
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בפנייה לAI" }, { status: 500 });
  }
}
