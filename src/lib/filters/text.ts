import { ActiveGroup, RequestGroup, User } from '../dal';

interface FilterableProperties {
    title: string,
    description: string,
    category: string,
    basePrice?: number;
    groupPrice?: number;
    participants?: User[];
    minParticipants?: number;
    maxParticipants?: number;
}

const searchableKeys: (keyof FilterableProperties)[] = [
    "title", "description", "category", "basePrice", "groupPrice", "participants", "minParticipants", "maxParticipants"
];

export function filterByText<T extends ActiveGroup | RequestGroup>(items: T[], searchText: string): T[] {
    // for empty search text, return all items
    if (!searchText.trim()) {
        return items;
    }
    const textLowerTrimmed: string = searchText.toLowerCase().trim();

    return items.filter((item) => {
        return (searchableKeys as readonly (keyof FilterableProperties)[]).some((key) => {
            if (key in item) {
                const value = key === "participants" ? item.participants.length : item[key as keyof typeof item];
                return String(value ?? "").toLowerCase().includes(textLowerTrimmed);
            }
            return false;
        });

        // TODO: If the data will be displayed somehow, for RequestGroup consider search in specific properties of the relevant OpenActiveGroups.
        // TODO: Enable Search in countdown text (days, hours, minutes in Hebrew)

        // const now: number = new Date().getTime();
        // const end: number = new Date(activeGroup.deadline).getTime();
        // const diff: number = end - now;

        // if (diff > 0) {
        //     const days: number = Math.floor(diff / (1000 * 60 * 60 * 24));
        //     const hours: number = Math.floor((diff / (1000 * 60 * 60)) % 24);
        //     const minutes: number = Math.floor((diff / (1000 * 60)) % 60);
        //     const seconds: number = Math.floor((diff / 1000) % 60);

        //     if (searchLowerTrimmed.includes('ימים') && days > 0) {
        //         return true;
        //     }
        //     if (searchLowerTrimmed.includes('שעות') && hours > 0) {
        //         return true;
        //     }
        //     if (searchLowerTrimmed.includes('דקות') && minutes > 0) {
        //         return true;
        //     }
        //     if (searchLowerTrimmed.includes('שניות') && seconds > 0) {
        //         return true;
        //     }
        //     if (searchLowerTrimmed.includes('%')) { 
        //         return true;
        //     }
        // }
    });
}

