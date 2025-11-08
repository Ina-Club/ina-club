import { ActiveGroup, PublicGroup, RequestGroup } from "../dal";

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

function toPublicGroupFromRequest(request: RequestGroup): PublicGroup {
  return {
    id: request.id,
    category: request.category,
    title: request.title,
    description: request.description,
  };
}

function toPublicGroup(item: ActiveGroup | RequestGroup): PublicGroup {
  return ("groupPrice" in item || "basePrice" in item)
    ? toPublicGroupFromActive(item as ActiveGroup)
    : toPublicGroupFromRequest(item as RequestGroup);
}

export function toPublicGroups(items: Array<ActiveGroup | RequestGroup>): PublicGroup[] {
  return items.map(toPublicGroup);
}
