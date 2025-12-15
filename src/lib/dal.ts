import { GroupStatus } from "./types/status";

export interface RequestGroup {
  id: string;
  images: string[];
  category: string;
  title: string;
  participants: User[];
  openedGroups?: string[]; //TODO: Remove
  status: GroupStatus;
  description?: string;
  rejectionReason?: string;
}

export interface User {
  firstName: string;
  image: string;
}

export interface ActiveGroup {
  id: string;
  title: string;
  description?: string;
  status: GroupStatus;
  category: string;
  basePrice: number;
  groupPrice: number;
  minParticipants?: number;
  maxParticipants?: number;
  deadline: Date;
  createdAt?: Date;
  company?: Company;
  participants: User[];
  images: string[];
}

export interface Company {
  id: string;
  logo: { id: string, url: string };
  title: string;
  subTitle: string;
  categories: string[];
  url: string;
}

export interface PublicGroup {
  id: string;
  category: string;
  title: string;
  description?: string;
  basePrice?: number;
  groupPrice?: number;
}
