import { GroupStatus } from "./types/status";
import { LikeTargetType } from "./types/like";
import type { CouponStatus } from "@/lib/types/status";

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
  registrationTerms?: string;
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

export interface Like {
    id: string;
    userId: string;
    targetId: string;
    targetType: LikeTargetType;
}

export interface CouponData {
  id: string;
  code: string;
  groupId: string;
  groupTitle: string;
  validTo: string;
  status: CouponStatus;
  createdAt: string;
}
