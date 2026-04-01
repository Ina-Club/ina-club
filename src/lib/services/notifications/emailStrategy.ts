import { Resend } from 'resend';
import { INotificationStrategy, NotificationContext } from './types';

const resend = new Resend(process.env.RESEND_API_KEY!);

export class EmailNotificationStrategy implements INotificationStrategy {
  async send(context: NotificationContext): Promise<boolean> {
    if (!context.email) return false;

    // TODO: Change to generic email template
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'INA Club <noreply@ina.club>',
        to: [context.email],
        subject: `קבוצת ${context.groupTitle} הופעלה! קוד ההנחה שלך בפנים`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>היי!</h2>
            <p>הקבוצה <strong>${context.groupTitle}</strong> שהצטרפת אליה הופעלה בהצלחה.</p>
            <p>להלן קוד ההנחה שלך למימוש הקנייה:</p>
            <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; display: inline-block; margin: 10px 0;">
              ${context.couponCode}
            </div>
            <p><small>הקוד בתוקף עד: ${new Date(context.validTo).toLocaleDateString('he-IL')}</small></p>
            <p>תודה,<br>צוות INA Club</p>
          </div>
        `
      });

      if (error) {
        console.error("Resend Error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Failed to send email to " + context.email, err);
      return false;
    }
  }
}
