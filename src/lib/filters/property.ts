import { ActiveGroup, RequestGroup } from '../dal';
import { FilterState } from '@/components/group-filters/filters';

export function filterByProperties<T extends ActiveGroup | RequestGroup>(
  items: T[],
  filterState: FilterState
): T[] {
  let filtered = items;

  if (filterState.categories.length > 0) {
    filtered = filtered.filter(item =>
      filterState.categories.includes(item.category)
    );
  }

  // TODO: Implement location filtering
  if (filterState.locations.length > 0) {
    filtered = filtered.filter(item => { return true; });
  }

  // TODO: Implement popularity filtering
  if (filterState.popularities.length > 0) {
    filtered = filtered.filter(item => { return true; });
  }

  // Apply price filter (only for ActiveGroup)
  if (filtered.length && "price" in filtered[0]) {
    const activeGroups = filtered as ActiveGroup[];
    filtered = activeGroups.filter(item => {
      const price = item.price;
      return price >= filterState.priceRange![0] && price <= filterState.priceRange![1];
    }) as T[];
  }

  return filtered;
}
