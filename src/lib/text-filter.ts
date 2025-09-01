import { ActiveGroup, RequestGroup } from './dal';

export function filterByText<T extends ActiveGroup | RequestGroup>(items: T[], searchText: string): T[] {
    // for empty search text, return all items
    if (!searchText.trim()) {
        return items;
    }

    const searchLowerTrimmed = searchText.toLowerCase().trim();

    return items.filter((item) => {
        if (item.title.toLowerCase().includes(searchLowerTrimmed)) {
            return true;
        }
        if (item.category.toLowerCase().includes(searchLowerTrimmed)) {
            return true;
        }
        if (item.participants.some(participant =>
            participant.name.toLowerCase().includes(searchLowerTrimmed)
        )) {
            return true;
        }

        // For ActiveGroup, search in price and other specific fields
        if ('price' in item) {
            const activeGroup = item as ActiveGroup;

            if (activeGroup.price.toString().includes(searchLowerTrimmed)) {
                return true;
            }
            if (activeGroup.numberOfParticipants.toString().includes(searchLowerTrimmed)) {
                return true;
            }
            if (activeGroup.deadline.toString().toLowerCase().includes(searchLowerTrimmed)) {
                return true;
            }

            // Search in countdown text (days, hours, minutes in Hebrew)
            const now = new Date().getTime();
            const end = new Date(activeGroup.deadline).getTime();
            const diff = end - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                if (searchLowerTrimmed.includes('ימים') && days > 0) {
                    return true;
                }
                if (searchLowerTrimmed.includes('שעות') && hours > 0) {
                    return true;
                }
                if (searchLowerTrimmed.includes('דקות') && minutes > 0) {
                    return true;
                }
                if (searchLowerTrimmed.includes('שניות') && seconds > 0) {
                    return true;
                }
                if (searchLowerTrimmed.includes('%')) { 
                    return true;
                }
            }
        }

        // For RequestGroup, search in openedGroups info
        if ('openedGroups' in item) {
            const requestGroup = item as RequestGroup;

            if (requestGroup.openedGroups.some((group) => group.title.toLowerCase().includes(searchLowerTrimmed))) {
                return true;
            }
        }
        return false;
    });
}
