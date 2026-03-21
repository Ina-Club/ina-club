import { ActiveGroup, Company } from "./dal";
import { GroupStatus } from "./types/status";


export const mockActiveGroups: ActiveGroup[] = [
  {
    id: "macbook-group-1",
    images: ["/BravoMateo.png", "https://picsum.photos/seed/laptop2/400/300"],
    category: "אלקטרוניקה",
    title: "MacBook Group 1",
    participants: [
      {
        image: "https://i.pravatar.cc/150?img=1",
        firstName: "דנה לוי",
      },
      {
        image: "https://i.pravatar.cc/150?img=2",
        firstName: "אורי כהן",
      },
    ],
    price: 6200,
    numberOfParticipants: 2,
    deadline: new Date("2025-09-15T23:59:59Z"),
  },
  {
    id: "macbook-group-2",
    images: ["/BravoMateo.png"],
    category: "אלקטרוניקה",
    title: "MacBook Group 2",
    participants: [
      {
        image: "https://i.pravatar.cc/150?img=3",
        firstName: "רועי ישראלי",
      },
    ],
    price: 6200,
    numberOfParticipants: 1,
    deadline: new Date("2025-09-20T23:59:59Z"),
  },
  {
    id: "iphone-group-1",
    images: ["/BravoMateo.png", "https://picsum.photos/seed/phone2/400/300"],
    category: "סמארטפונים",
    title: "iPhone Group 1",
    participants: [
      {
        image: "https://i.pravatar.cc/150?img=4",
        firstName: "שירה בן דוד",
      },
    ],
    price: 4890,
    numberOfParticipants: 1,
    deadline: new Date("2025-09-12T20:00:00Z"),
  },
  {
    id: "sony-group-1",
    images: [
      "/BravoMateo.png",
      "https://picsum.photos/seed/headphones2/400/300",
    ],
    category: "אודיו",
    title: "Sony Group 1",
    participants: [
      {
        image: "https://i.pravatar.cc/150?img=6",
        firstName: "יעל פרידמן",
      },
      {
        image: "https://i.pravatar.cc/150?img=7",
        firstName: "דניאל לוין",
      },
    ],
    price: 1290,
    numberOfParticipants: 2,
    deadline: new Date("2025-09-05T18:00:00Z"),
  },
] as any;
