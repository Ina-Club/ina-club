import { NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { SmartSearchResponse } from "../../../../lib/types/smart-search";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { searchQuery, context } = await req.json();

    if (!searchQuery || searchQuery.trim() === "") {
      return NextResponse.json({ error: "חיפוש ריק" }, { status: 400 });
    }

    const isInitialSearch = !context || Object.keys(context).length === 0;

    const prompt = isInitialSearch
      ? `
אתה עוזר חכם לרכישות קבוצתיות בישראל.
המשתמש חיפש: "${searchQuery}".

עליך להחזיר תשובה אך ורק בפורמט JSON לפי אחד משני המצבים הבאים:

אם אין מספיק מידע כדי להעריך מחיר:
{
  "needsMoreInfo": true,
  "category": "שם הקטגוריה (למשל: סוג רכב, דגם רכב, יצרן טלפון)",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית"
}

אם יש מספיק מידע:
{
  "needsMoreInfo": false,
  "productName": "שם המוצר המלא",
  "category": "קטגוריה",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-40),
  "finalPrice": מספר,
  "notes": "הסבר קצר והמלצות"
}

דוגמאות:
- "אוטו" → החזר needsMoreInfo עם קטגוריה "סוג רכב" ואופציות כמו ["טויוטה", "מאזדה", "הונדה"]
- "טויוטה" → החזר needsMoreInfo עם קטגוריה "דגם רכב" ואופציות כמו ["קורולה", "יאריס", "קאמרי"]
- "טויוטה קורולה 2023" → החזר needsMoreInfo=false עם הערכת מחיר והנחה
      `
      : `
אתה עוזר חכם לרכישות קבוצתיות בישראל.
המשתמש בחר את האפשרויות הבאות: ${JSON.stringify(context, null, 2)}
והחיפוש המקורי היה: "${searchQuery}".

נתח את הנתונים והחזר אך ורק באחד משני הפורמטים הבאים:

אם עדיין חסר מידע להערכה — חובה להשתמש באותו מבנה כמו קודם:
{
  "needsMoreInfo": true,
  "category": "שם הקטגוריה (למשל: סוג רכב, דגם רכב, יצרן טלפון)",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית"
}

אם יש מספיק מידע:
{
  "needsMoreInfo": false,
  "productName": "שם המוצר המלא",
  "category": "קטגוריה",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-40),
  "finalPrice": מספר,
  "notes": "הסבר קצר והמלצות"
}

אסור להשתמש במבנים אחרים כגון "missingFields" או כל שדה אחר.
      `;

    const responseSchema = {
      type: "object",
      properties: {
        needsMoreInfo: { type: "boolean" },
        category: { type: "string" },
        options: {
          type: "array",
          items: { type: "string" },
        },
        message: { type: "string" },
        productName: { type: "string" },
        estimatedPrice: { type: "number" },
        groupDiscount: { type: "number" },
        finalPrice: { type: "number" },
        notes: { type: "string" },
      },
      required: ["needsMoreInfo"],
    };

    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: { schema: responseSchema },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    });

    const responseText = resp.text;
    if (!responseText) throw new Error("No response from AI");

    const data = JSON.parse(responseText);
    console.log("AI Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Smart search error:", error);
    return NextResponse.json(
      { error: "שגיאה בחיפוש החכם" },
      { status: 500 }
    );
  }
}
