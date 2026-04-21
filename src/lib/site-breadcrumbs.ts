/** Hebrew labels for consistent navigation copy across the app */

export const SITE = {
  home: "דף הבית",
  activeGroups: "קבוצות פעילות",
  requests: "בקשות מהקהילה",
  smartSearch: "חיפוש חכם",
  priceAnalyzer: "מנתח מחירים",
  companies: "חברות שותפות",
  profile: "הפרופיל שלי",
  about: "מי אנחנו",
  contact: "צור קשר",
  privacy: "מדיניות פרטיות",
  terms: "תנאי שימוש",
} as const;

export type BreadcrumbItem = { label: string; href?: string };
