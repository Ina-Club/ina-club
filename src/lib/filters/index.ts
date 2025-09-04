import { ActiveGroup, RequestGroup } from '../dal';
import { FilterState } from '@/components/group-filters/filters';
import { filterByText } from './text';
import { filterByProperties } from './property';

// TODO: currently, whenever a filter is applied, we re-calculate all filters over and over.
// This is inefficient and can lead to long filter times for each filter change.
// Consider optimization if necessary.
export function applyFilters<T extends ActiveGroup | RequestGroup>(
  items: T[],
  searchText: string,
  filterState: FilterState
): T[] {
  let filtered = items;
  if (filtered.length === 0) return filtered;

  filtered = filterByText(items, searchText); // First filter by text to reduce dataset.
  return filterByProperties(filtered, filterState);
}
