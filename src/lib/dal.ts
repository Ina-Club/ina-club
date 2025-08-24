export interface RequestGroup {
    images: string[];
    category: string;
    title: string;
    participants: User[];
    price: number;
}

export interface User {
    image: string;
    name: string;
    mail: string;
}