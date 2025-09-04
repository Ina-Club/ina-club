import { ActiveGroup, RequestGroup } from './dal';
import { FilterState } from '@/components/group-filters/filters';

export function applyFilters<T extends ActiveGroup | RequestGroup>(
  items: T[],
  searchText: string,
  filterState: FilterState
): T[] {
  let filtered = items;

  // Apply text filter first
  if (searchText.trim()) {
    filtered = filterByText(filtered, searchText);
  }

  // Apply category filter
  if (filterState.categories.length > 0) {
    filtered = filtered.filter(item => 
      filterState.categories.includes(item.category)
    );
  }

  // Apply location filter (if location data exists in items)
  if (filterState.locations.length > 0) {
    // Note: This assumes items have a location property. 
    // You may need to add this to your data model or adjust based on your data structure
    filtered = filtered.filter(item => {
      // For now, we'll skip location filtering since it's not in the current data model
      // You can implement this when location data is available
      return true;
    });
  }

  // Apply popularity filter (if popularity data exists in items)
  if (filterState.popularities.length > 0) {
    // Note: This assumes items have a popularity property.
    // You may need to add this to your data model or adjust based on your data structure
    filtered = filtered.filter(item => {
      // For now, we'll skip popularity filtering since it's not in the current data model
      // You can implement this when popularity data is available
      return true;
    });
  }

  // Apply price filter (only for ActiveGroup)
  if ('price' in filtered[0] || filtered.length === 0) {
    const activeGroups = filtered as ActiveGroup[];
    filtered = activeGroups.filter(item => {
      const price = item.price;
      return price >= filterState.priceRange[0] && price <= filterState.priceRange[1];
    }) as T[];
  }

  return filtered;
}

// Text filter function (moved from text-filter.ts for better organization)
function filterByText<T extends ActiveGroup | RequestGroup>(
  items: T[],
  searchText: string
): T[] {
  if (!searchText.trim()) {
    return items;
  }

  const searchLower = searchText.toLowerCase().trim();
  
  return items.filter((item) => {
    // Search in title
    if (item.title.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search in category
    if (item.category.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search in participants names
    if (item.participants.some(participant => 
      participant.name.toLowerCase().includes(searchLower)
    )) {
      return true;
    }
    
    // Search in participants emails
    if (item.participants.some(participant => 
      participant.mail.toLowerCase().includes(searchLower)
    )) {
      return true;
    }
    
    // For ActiveGroup, search in all specific properties
    if ('price' in item) {
      const activeGroup = item as ActiveGroup;
      
      // Search in price
      if (activeGroup.price.toString().includes(searchLower)) {
        return true;
      }
      
      // Search in number of participants
      if (activeGroup.numberOfParticipants.toString().includes(searchLower)) {
        return true;
      }
      
      // Search in deadline (convert to string for searching)
      if (activeGroup.deadline.toString().toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in ID
      if (activeGroup.id.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    
    // For RequestGroup, search in all specific properties
    if ('openedGroups' in item) {
      const requestGroup = item as RequestGroup;
      
      // Search in opened groups titles
      if (requestGroup.openedGroups.some(group => 
        group.title.toLowerCase().includes(searchLower)
      )) {
        return true;
      }
      
      // Search in opened groups categories
      if (requestGroup.openedGroups.some(group => 
        group.category.toLowerCase().includes(searchLower)
      )) {
        return true;
      }
      
      // Search in opened groups IDs
      if (requestGroup.openedGroups.some(group => 
        group.id.toLowerCase().includes(searchLower)
      )) {
        return true;
      }
    }
    
    return false;
  });
}

