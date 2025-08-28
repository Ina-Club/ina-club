
export interface RequestGroup {
  images: string[];
  category: string;
  title: string;
  participants: User[];
  openedGroups: ActiveGroup[];
}

export interface User {
  image: string;
  name: string;
  mail: string;
}

export interface ActiveGroup {
    id: string;
    images: string[];
    category: string;
    title: string;
    participants: User[];
    price: number;
    numberOfParticipants: number;
    deadline: Date; // ⬅️ new field
  }