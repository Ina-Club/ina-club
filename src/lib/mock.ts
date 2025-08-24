import { RequestGroup } from "./dal";

export const mockRequestGroups: RequestGroup[] = [
    {
      images: [
        "https://picsum.photos/seed/laptop/400/300",
        "https://picsum.photos/seed/laptop2/400/300",
      ],
      category: "אלקטרוניקה",
      title: "MacBook Pro M3",
      participants: [
        {
          image: "https://i.pravatar.cc/150?img=1",
          name: "דנה לוי",
          mail: "dana@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=2",
          name: "אורי כהן",
          mail: "uri@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=3",
          name: "רועי ישראלי",
          mail: "roi@example.com",
        },
      ],
      price: 6200,
    },
    {
      images: [
        "https://picsum.photos/seed/phone/400/300",
        "https://picsum.photos/seed/phone2/400/300",
      ],
      category: "סמארטפונים",
      title: "iPhone 16 Pro Max",
      participants: [
        {
          image: "https://i.pravatar.cc/150?img=4",
          name: "שירה בן דוד",
          mail: "shira@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=5",
          name: "נועם ברק",
          mail: "noam@example.com",
        },
      ],
      price: 4890,
    },
    {
      images: [
        "https://picsum.photos/seed/headphones/400/300",
        "https://picsum.photos/seed/headphones2/400/300",
      ],
      category: "אודיו",
      title: "Sony WH-1000XM5",
      participants: [
        {
          image: "https://i.pravatar.cc/150?img=6",
          name: "יעל פרידמן",
          mail: "yael@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=7",
          name: "דניאל לוין",
          mail: "daniel@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=8",
          name: "אלכס חיון",
          mail: "alex@example.com",
        },
        {
          image: "https://i.pravatar.cc/150?img=9",
          name: "תמר עזרא",
          mail: "tamar@example.com",
        },
      ],
      price: 1290,
    },
  ];