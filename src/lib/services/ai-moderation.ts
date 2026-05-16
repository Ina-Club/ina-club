import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface ModerationResult {
  isValid: boolean;
  reason?: string;
}

export async function moderateContent(text: string): Promise<ModerationResult> {
  const prompt = `
אתה מערכת מודרציה של תוכן לאתר קניות קבוצתיות בישראל.

בדוק את הטקסט הבא ובדוק אם הוא מכיל:
- קללות או שפה פוגעת
- תוכן לא חוקי, נשק, סמים, חומרים מסוכנים, פריטים גנובים (גם אם כתובים בראשי תיבות או עם נקודות כגון א.ק.ד.ח, נ.ש.ק וכד')
- מספרי טלפון
- כתובות אימייל
- מספרי תעודת זהות או מספרים אישיים אחרים
- קישורים לאתרים חיצוניים
- תוכן מיני או פוגעני
- אלימות מכל סוג שהיא

שימו לב: כל נסיון לעקוף את החסימה באמצעות אותיות מופרדות, סימנים או ראשי תיבות של דברים לא חוקיים נחשב לעבירה ויש לפסול את התוכן!

טקסט לבדיקה: "${text}"

החזר JSON בלבד:
{
  "isValid": true/false,
  "reason": "הסיבה לפסילה בעברית (רק אם isValid הוא false)"
}
`;

  try {
    const resp = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL!,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          schema: {
            type: "object",
            properties: {
              isValid: { type: "boolean" },
              reason: { type: "string" },
            },
            required: ["isValid"],
          },
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        ],
      },
    });

    const responseText = resp.text;
    if (!responseText) return { isValid: true };

    const data = JSON.parse(responseText);
    return {
      isValid: data.isValid !== false,
      reason: data.reason,
    };
  } catch (err) {
    console.error("Moderation error:", err);
    // Fail open — don't block users on moderation errors
    return { isValid: true };
  }
}
