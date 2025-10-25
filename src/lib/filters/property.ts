import { ActiveGroup, RequestGroup } from '../dal';
import { FilterState } from '@/components/group-filters/filters';

function isActiveGroup(g: ActiveGroup | RequestGroup): g is ActiveGroup {
  return "groupPrice" in g && typeof (g as any).groupPrice === "number";
}

export function filterByProperties<T extends ActiveGroup | RequestGroup>(
  items: T[],
  filterState: FilterState
): T[] {
  let filtered: T[] = items;

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
  if (filtered.length && filterState?.priceRange) {
    const [minPrice, maxPrice] = filterState.priceRange
    filtered = filtered.filter(item => {
      if (!isActiveGroup(item)) return true; // keep non-active items
      const price = item.groupPrice;         // safe: item is ActiveGroup
      return price >= minPrice && price <= maxPrice;
    });
  }

  return filtered;
}
