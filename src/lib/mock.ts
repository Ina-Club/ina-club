import { ActiveGroup, RequestGroup } from "./dal";

export const mockRequestGroups: RequestGroup[] = [
  {
    images: ["/BravoMateo.png", "https://picsum.photos/seed/laptop2/400/300"],
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
    openedGroups: [
      {
        id: "macbook-group-1",
        images: [
          "/BravoMateo.png",
          "https://picsum.photos/seed/laptop2/400/300",
        ],
        category: "אלקטרוניקה",
        title: "MacBook Group 1",
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
            name: "רועי ישראלי",
            mail: "roi@example.com",
          },
        ],
        price: 6200,
        numberOfParticipants: 1,
        deadline: new Date("2025-09-20T23:59:59Z"),
      },
    ],
  },
  {
    images: ["/BravoMateo.png", "https://picsum.photos/seed/phone2/400/300"],
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
    openedGroups: [
      {
        id: "iphone-group-1",
        images: [
          "/BravoMateo.png",
          "https://picsum.photos/seed/phone2/400/300",
        ],
        category: "סמארטפונים",
        title: "iPhone Group 1",
        participants: [
          {
            image: "https://i.pravatar.cc/150?img=4",
            name: "שירה בן דוד",
            mail: "shira@example.com",
          },
        ],
        price: 4890,
        numberOfParticipants: 1,
        deadline: new Date("2025-09-12T20:00:00Z"),
      },
    ],
  },
  {
    images: [
      "/BravoMateo.png",
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
    openedGroups: [
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
            name: "יעל פרידמן",
            mail: "yael@example.com",
          },
          {
            image: "https://i.pravatar.cc/150?img=7",
            name: "דניאל לוין",
            mail: "daniel@example.com",
          },
        ],
        price: 1290,
        numberOfParticipants: 2,
        deadline: new Date("2025-09-05T18:00:00Z"),
      },
    ],
  },
];


export const mockActiveGroups: ActiveGroup[] = [
    {
      id: "macbook-group-1",
      images: ["/BravoMateo.png", "https://picsum.photos/seed/laptop2/400/300"],
      category: "אלקטרוניקה",
      title: "MacBook Group 1",
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
          name: "רועי ישראלי",
          mail: "roi@example.com",
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
          name: "שירה בן דוד",
          mail: "shira@example.com",
        },
      ],
      price: 4890,
      numberOfParticipants: 1,
      deadline: new Date("2025-09-12T20:00:00Z"),
    },
    {
      id: "sony-group-1",
      images: ["/BravoMateo.png", "https://picsum.photos/seed/headphones2/400/300"],
      category: "אודיו",
      title: "Sony Group 1",
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
      ],
      price: 1290,
      numberOfParticipants: 2,
      deadline: new Date("2025-09-05T18:00:00Z"),
    },
  ];