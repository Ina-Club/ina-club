import { Group } from "next/dist/shared/lib/router/utils/route-regex";

export interface RequestGroup {
    images: string[];
    category: string;
    title: string;
    participants: User[];
    price: number;
    openedGroups: ActiveGroup[];
}

export interface User {
    image: string;
    name: string;
    mail: string;
}
export interface ActiveGroup {
    id:string;
}