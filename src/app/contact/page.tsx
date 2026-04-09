import { StaticPageLayout, StaticPageSection } from "@/components/static-page/static-page-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר | Ina Club",
  description: "כל הדרכים ליצור קשר עם צוות Ina Club לשאלות, תמיכה ושיתופי פעולה.",
};

const sections: StaticPageSection[] = [
  {
    title: "איך נוכל לעזור?",
    paragraphs: [
      "אנחנו כאן כדי לסייע בכל שאלה על קבוצות, תשלומים, חיבור לספקים או הצעות לשיפור. בחרו את ערוץ הקשר הנוח לכם ונחזור בהקדם.",
    ],
  },
  {
    title: "ערוצי קשר",
    customContent: (
      <ul style={{ margin: 0, paddingInlineStart: "20px", lineHeight: 1.7 }}>
        <li>
          מייל כללי ותמיכה:{" "}
          <a href="mailto:support@ina-club.com" style={{ color: "#1a2a5a", fontWeight: 600 }}>
            support@ina-club.com
          </a>
        </li>
        <li>
          שיתופי פעולה עסקיים:{" "}
          <a href="mailto:partnerships@ina-club.com" style={{ color: "#1a2a5a", fontWeight: 600 }}>
            partnerships@ina-club.com
          </a>
        </li>
        <li>דיווח על תקלה: ניתן לצרף צילום מסך או תיאור של הצעדים שהובילו לבעיה.</li>
      </ul>
    ),
  },
  {
    title: "שעות מענה",
    paragraphs: [
      "א'-ה' 09:00-18:00. פניות שמתקבלות מחוץ לשעות הפעילות יטופלו בתחילת יום העבודה הבא.",
      "במקרי חירום תפעולי (למשל כשל תשלום בזמן סגירת קבוצה), ציינו זאת בכותרת המייל כדי לתעדף טיפול.",
    ],
  },
  {
    title: "מה כדאי לכלול בפנייה",
    bullets: [
      "שם מלא וכתובת דוא\"ל המשויכת לחשבון.",
      "מספר קבוצה או קישור רלוונטי, במידת האפשר.",
      "תיאור קצר של הבקשה או התקלה, וצילום מסך אם ניתן.",
    ],
  },
  {
    title: "התחייבות לשירות",
    paragraphs: [
      "אנחנו שואפים לתת תשובה ראשונית בתוך יום עסקים אחד ולפתור תקלות במהירות האפשרית.",
    ],
  },
];

export default function ContactPage() {
  return (
    <StaticPageLayout
      header="צור קשר"
      description="צוות Ina Club כאן בשבילכם — תמיכה, שיתופי פעולה ושאלות כלליות."
      sections={sections}
    />
  );
}

