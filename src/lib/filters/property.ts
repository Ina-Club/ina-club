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
  // TODO: Maybe a better filter mecha than this one :(
  if (filtered.length && "price" in filtered[0]) {
    const activeGroups = filtered as ActiveGroup[];
    const [minPrice, maxPrice] = filterState.priceRange!
    filtered = activeGroups.filter(item => {
      const price = item.price;
      return price >= minPrice && price <= maxPrice;
    }) as T[];
  }

  return filtered;
}
