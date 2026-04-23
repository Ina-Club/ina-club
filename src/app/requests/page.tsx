import { Metadata } from "next";
import { RequestsPageView } from "./RequestsPageView";

export const metadata: Metadata = {
  title: "בקשות | Ina Club",
  description: "כאן תוכלו לראות מה הקהילה רוצה לרכוש ולסמן בלייק בבקשות של אחרים.",
  icons: { icon: "/InaclubAppLogo.png" },
};

export default function RequestsPage() {
  return <RequestsPageView />;
}
