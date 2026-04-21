import { ActiveGroup, PublicGroup } from "../dal";

function toPublicGroupFromActive(active: ActiveGroup): PublicGroup {
  return {
    id: active.id,
    category: active.category,
    title: active.title,
    description: active.description,
    basePrice: active.basePrice,
    groupPrice: active.groupPrice,
  };
}

export function toPublicGroups(items: Array<ActiveGroup>): PublicGroup[] {
  return items.map(toPublicGroupFromActive);
}
