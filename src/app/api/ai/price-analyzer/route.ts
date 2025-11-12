import { NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

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

    // נקה את ה-context מערכים של דילוג על פרטים
    const cleanedContext = { ...context };
    let hasSkipDetails = false;

    for (const [key, value] of Object.entries(cleanedContext)) {
      if (value === "__SKIP_DETAILS__") {
        delete cleanedContext[key];
        hasSkipDetails = true;
      }
    }

    const isInitialSearch = !context || Object.keys(context).length === 0;

    const prompt = isInitialSearch
      ? `
אתה עוזר חכם לרכישות קבוצתיות בישראל.
עליך לענות אך ורק בעברית — אין לכתוב אף מילה בשפה אחרת.

המשתמש חיפש: "${searchQuery}".

החזר תשובה בפורמט JSON בלבד לפי אחד מהמצבים הבאים:

1️⃣ אם אין מספיק מידע כדי להעריך מחיר במדויק ויש אופציות ספציפיות לבחירה:
{
  "needsMoreInfo": true,
  "category": "שם הקטגוריה (למשל: סוג רכב, דגם טלפון, יצרן טלוויזיה)",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית בלבד"
}

שים לב — אם המשתמש מזין ערך שלא מופיע באופציות (למשל כותב ידנית משהו אחר), יש לקבל זאת כבחירה לגיטימית ולהמשיך כרגיל.

2️⃣ אם יש מספיק מידע למחיר מדויק:
{
  "needsMoreInfo": false,
  "productName": "שם המוצר המלא בעברית",
  "category": "קטגוריה בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-40),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר קצר והמלצות בעברית בלבד"
}

3️⃣ אם אין מספיק מידע אבל אפשר לתת הערכה גסה (כשאין אופציות ספציפיות לבחירה או כשהמשתמש ביקש לדלג על הפרטים):
{
  "needsMoreInfo": false,
  "productName": "שם המוצר הכללי בעברית",
  "category": "קטגוריה כללית בעברית",
  "estimatedPrice": מספר (הערכה גסה),
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-25 - הנחה נמוכה יותר בגלל אי הוודאות),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר בעברית שזה מחיר הערכה בלבד ומומלץ לדייק את החיפוש למחיר מדויק יותר"
}

אין להשתמש בשפות אחרות, במבנים אחרים או בשדות שאינם מופיעים כאן.

דוגמאות:
- "אוטו" → החזר needsMoreInfo עם קטגוריה "סוג רכב" ואופציות ["טויוטה", "מאזדה", "הונדה"]
- "טויוטה" → החזר needsMoreInfo עם קטגוריה "דגם רכב" ואופציות ["קורולה", "יאריס", "קאמרי"]
- "טויוטה קורולה 2023" → החזר תשובה מלאה עם הערכת מחיר והנחה
- "משהו לא מוכר" או "דבר כללי" → החזר הערכה גסה עם הסבר שזה מחיר משוער בלבד
      `
      : `
אתה עוזר חכם לרכישות קבוצתיות בישראל.
עליך לענות אך ורק בעברית — אין לכתוב אף מילה בשפה אחרת.

המשתמש בחר את האפשרויות הבאות: ${JSON.stringify(cleanedContext, null, 2)}
והחיפוש המקורי היה: "${searchQuery}".
${hasSkipDetails ? "המשתמש ביקש לדלג על הפרטים המדויקים ולקבל הערכה גסה." : ""}

החזר תשובה רק באחד מהפורמטים הבאים (בעברית בלבד):

1️⃣ אם עדיין חסר מידע מדויק ולא ביקשו לדלג על הפרטים:
{
  "needsMoreInfo": true,
  "category": "שם הקטגוריה (למשל: סוג רכב, דגם טלפון, יצרן טלוויזיה)",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית בלבד"
}

2️⃣ אם יש מספיק מידע למחיר מדויק:
{
  "needsMoreInfo": false,
  "productName": "שם המוצר המלא בעברית",
  "category": "קטגוריה בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-40),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר קצר והמלצות בעברית בלבד"
}

3️⃣ אם אין מספיק מידע אבל אפשר לתת הערכה גסה (או אם המשתמש ביקש לדלג על הפרטים):
{
  "needsMoreInfo": false,
  "productName": "שם המוצר הכללי בעברית",
  "category": "קטגוריה כללית בעברית",
  "estimatedPrice": מספר (הערכה גסה),
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-25 - הנחה נמוכה יותר בגלל אי הוודאות),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר בעברית שזה מחיר הערכה בלבד ומומלץ לדייק את החיפוש למחיר מדויק יותר"
}

אין להשתמש בשפות אחרות או בשדות שאינם מופיעים כאן.
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
        minGroupPrice: { type: "number" },
        averageGroupPrice: { type: "number" },
        maxGroupPrice: { type: "number" },
        notes: { type: "string" },
      },
      required: ["needsMoreInfo"],
      oneOf: [
        {
          properties: { needsMoreInfo: { const: true } },
          required: ["needsMoreInfo", "category", "options", "message"],
        },
        {
          properties: { needsMoreInfo: { const: false } },
          required: [
            "needsMoreInfo",
            "productName",
            "category",
            "estimatedPrice",
            "groupDiscount",
            "minGroupPrice",
            "averageGroupPrice",
            "maxGroupPrice",
            "notes",
          ],
        },
      ],
    };

    const resp = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL!,
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
    if (!responseText) throw new Error("לא התקבלה תשובה מה-AI");

    const data = JSON.parse(responseText);
    console.log("AI Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("price analyzer error:", error);
    return NextResponse.json(
      { error: "שגיאה בחיפוש החכם" },
      { status: 500 }
    );
  }
}
