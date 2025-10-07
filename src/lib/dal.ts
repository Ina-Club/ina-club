import { GroupStatus } from "./types/status";

export interface RequestGroup {
  id: string;
  images: string[];
  category: string;
  title: string;
  participants: User[];
  openedGroups: ActiveGroup[];
  status: GroupStatus;
  description?: string;
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

export interface Company {
  id: string;
  logo: string;
  title: string;
  subTitle: string;
  categories: string[];
  url: string;
}
