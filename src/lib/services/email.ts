import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "[EMAIL_ADDRESS]";
const REASON_LABELS: Record<string, string> = {
  SPAM: "ספאם",
  INAPPROPRIATE: "תוכן לא הולם",
  DUPLICATE: "בקשה כפולה",
  MISLEADING: "תוכן מטעה",
  OTHER: "אחר",
};

interface SendReportEmailParams {
  targetType: string;
  targetId: string;
  reason: string;
  description?: string | null;
  reporterId: string;
  targetTitle?: string;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const receiverEmail = process.env.NODE_ENV === "development" ? process.env.RESEND_TEST_EMAIL : process.env.EMAIL_TO;
  if (!receiverEmail) throw new Error("Receiver email not configured");

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "InaClub <noreply@inaclub.co.il>",
    to: receiverEmail,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) console.error("[email] Failed to send email:", error);
}

export async function sendReportEmail({
  targetType,
  targetId,
  reason,
  description,
  reporterId,
  targetTitle,
}: SendReportEmailParams): Promise<void> {
  const reasonLabel = REASON_LABELS[reason] ?? reason;

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a2a5a;">🚩 דיווח חדש</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">סוג</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${targetType}</td>
        </tr>
        ${targetTitle ? `
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">כותרת פריט</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${targetTitle}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">מזהה</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-family: monospace;">${targetId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">סיבה</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${reasonLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">מדווח/ת</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-family: monospace;">${reporterId}</td>
        </tr>
        ${description
      ? `<tr>
                <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">תיאור</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${description}</td>
              </tr>`
      : ""
    }
      </table>
    </div>
  `;

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `דיווח חדש: ${reasonLabel} — ${targetType} ${targetId.slice(0, 8)}`,
    html,
  });
}
