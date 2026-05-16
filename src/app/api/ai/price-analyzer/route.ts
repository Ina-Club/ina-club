import { NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { validateSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { DAILY_PRICE_ANALYSIS_LIMIT } from "@/app/config/quota";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId, response } = await validateSession();
    if (response) return response;

    const { searchQuery, context } = await req.json();

    if ((!searchQuery || !searchQuery.trim()) && !context) {
      return NextResponse.json({ error: "חיפוש ריק" }, { status: 400 });
    }

    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    oneWeekFromNow.setHours(0, 0, 0, 0);

    // Check if user is blocked due to violation
    const activity = await prisma.userActivity.findUnique({ where: { userId } });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    let currentCount = 0;
    if (activity?.lastPriceAnalysisDate && activity.lastPriceAnalysisDate >= startOfToday) {
      currentCount = activity.priceAnalysisCount || 0;
    }

    // Check daily quota for price analysis (only on initial search, not followup selects)
    const isInitialSearch = !context || Object.keys(context).length === 0;
    if (isInitialSearch) {
      if (currentCount >= DAILY_PRICE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: "הגעת למכסה היומית של ניתוחי מחיר. תוכל לנתח שוב מחר.", quotaReached: true },
          { status: 429 }
        );
      }
    }

    // Clean context from skip-detail markers
    const cleanedContext = { ...context };
    let hasSkipDetails = false;

    for (const [key, value] of Object.entries(cleanedContext)) {
      if (value === "__SKIP_DETAILS__") {
        delete cleanedContext[key];
        hasSkipDetails = true;
      }
    }

    const prompt = isInitialSearch
      ? `
אתה עוזר חכם לרכישות קבוצתיות בישראל.
עליך לענות אך ורק בעברית — אין לכתוב אף מילה בשפה אחרת.

המשתמש חיפש: "${searchQuery}".

בדיקת תוכן חובה:
1. אם החיפוש מכיל קללות, שפה פוגעת, תוכן לא חוקי (נשק, סמים, חומרים מסוכנים), מספרי טלפון, אימייל, קישורים לאתרים, או תוכן מיני — החזר בלבד:
{
  "isAnalyzable": false,
  "isIllegal": true
}

2. אם החיפוש הוא סתם ג'יבריש (למשל "דגכדגכ") או משהו שאי אפשר בכלל להעריך לו מחיר כיוון שאינו מוצר או שירות הגיוני — החזר בלבד:
{
  "isAnalyzable": false,
  "isIllegal": false
}

אחרת, החזר תשובה בפורמט JSON בלבד לפי אחד מהמצבים הבאים:

1️⃣ אם אין מספיק מידע כדי להעריך מחיר במדויק ויש אופציות ספציפיות לבחירה:
{
  "isAnalyzable": true,
  "needsMoreInfo": true,
  "isIllegal": false,
  "category": "שם הקטגוריה (למשל: סוג רכב, דגם טלפון, יצרן טלוויזיה)",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית בלבד"
}

2️⃣ אם יש מספיק מידע למחיר מדויק:
{
  "isAnalyzable": true,
  "needsMoreInfo": false,
  "isIllegal": false,
  "productName": "שם המוצר המלא בעברית",
  "category": "קטגוריה בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (אחוז הנחה בין 5 ל-40),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר קצר והמלצות בעברית בלבד"
}

3️⃣ אם אין מספיק מידע אבל אפשר לתת הערכה גסה:
{
  "isAnalyzable": true,
  "needsMoreInfo": false,
  "isIllegal": false,
  "productName": "שם המוצר הכללי בעברית",
  "category": "קטגוריה כללית בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (בין 5 ל-25),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר בעברית שזה מחיר הערכה בלבד"
}

אין להשתמש בשפות אחרות, במבנים אחרים או בשדות שאינם מופיעים כאן.
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
  "isAnalyzable": true,
  "needsMoreInfo": true,
  "isIllegal": false,
  "category": "שם הקטגוריה",
  "options": ["אפשרות 1", "אפשרות 2", ...],
  "message": "הודעה למשתמש בעברית בלבד"
}

2️⃣ אם יש מספיק מידע למחיר מדויק:
{
  "isAnalyzable": true,
  "needsMoreInfo": false,
  "isIllegal": false,
  "productName": "שם המוצר המלא בעברית",
  "category": "קטגוריה בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (בין 5 ל-40),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר קצר והמלצות בעברית בלבד"
}

3️⃣ אם אין מספיק מידע אבל אפשר לתת הערכה גסה (או אם המשתמש ביקש לדלג על הפרטים):
{
  "isAnalyzable": true,
  "needsMoreInfo": false,
  "isIllegal": false,
  "productName": "שם המוצר הכללי בעברית",
  "category": "קטגוריה כללית בעברית",
  "estimatedPrice": מספר,
  "groupDiscount": מספר (בין 5 ל-25),
  "minGroupPrice": מספר,
  "averageGroupPrice": מספר,
  "maxGroupPrice": מספר,
  "notes": "הסבר בעברית שזה מחיר הערכה בלבד"
}

אין להשתמש בשפות אחרות או בשדות שאינם מופיעים כאן.
      `;

    const responseSchema = {
      type: "object",
      properties: {
        isAnalyzable: { type: "boolean" },
        isIllegal: { type: "boolean" },
        reason: { type: "string" },
        needsMoreInfo: { type: "boolean" },
        category: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        message: { type: "string" },
        productName: { type: "string" },
        estimatedPrice: { type: "number" },
        groupDiscount: { type: "number" },
        minGroupPrice: { type: "number" },
        averageGroupPrice: { type: "number" },
        maxGroupPrice: { type: "number" },
        notes: { type: "string" },
      },
      required: ["isIllegal"],
    };

    const resp = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL!,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: { schema: responseSchema },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        ],
      },
    });

    const responseText = resp.text;
    if (!responseText) throw new Error("לא התקבלה תשובה מה-AI");

    const data = JSON.parse(responseText);
    console.log("AI Response:", data);

    // Consume quota if it's an initial search
    if (isInitialSearch) {
      await prisma.userActivity.upsert({
        where: { userId },
        create: { userId, lastPriceAnalysisDate: now, priceAnalysisCount: 1 },
        update: { lastPriceAnalysisDate: now, priceAnalysisCount: currentCount + 1 },
      });
    }

    // Handle illegal content from AI (don't block, just treat as unanalyzable per user request)
    if (data.isIllegal) {
      return NextResponse.json(
        {
          error: "לא ניתן לנתח מחיר לערך זה.",
          reason: "לא ניתן לנתח",
          unanalyzable: true,
        },
        { status: 422 }
      );
    }

    // Handle unanalyzable content (nonsense, generic, etc.)
    if (data.isAnalyzable === false) {
      return NextResponse.json(
        {
          error: "לא ניתן לנתח מחיר לערך זה.",
          unanalyzable: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("price analyzer error:", error);
    return NextResponse.json(
      { error: "שגיאה בחיפוש החכם" },
      { status: 500 }
    );
  }
}
