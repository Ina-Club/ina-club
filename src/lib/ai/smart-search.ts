import { ActiveGroup } from "@/lib/dal";
import { WishItemData } from "@/components/demand-pulse/WishItemCard";
import { SMART_SEARCH_PROMPT } from "@/ai/prompts";
import { toPublicGroups } from "@/lib/transformers/group";
import { filterGroupsByIds } from "@/lib/groups";
import { sendRequestToAi } from "@/lib/ai/ai";
import { SMART_SEARCH_GROUP_AMOUNT } from "@/app/config/smart-search";

export const aiFilteredGroups = async (activeGroups: ActiveGroup[], wishItems: WishItemData[], searchText: string) => {
    const { prompt, schema } = buildSmartSearchRequest(searchText, wishItems, activeGroups);
    const aiResponse: any = await sendRequestToAi(prompt, schema);
    const data: any = JSON.parse(aiResponse);
    const filteredActiveGroups: ActiveGroup[] = filterGroupsByIds(activeGroups, data.activeGroups) as ActiveGroup[];
    const filteredWishItems: WishItemData[] = wishItems.filter((wi) => data.wishItems.includes(wi.id));
    return { relevantActiveGroups: filteredActiveGroups, relevantWishItems: filteredWishItems, filtered: data.filtered };
}

const buildSmartSearchRequest = (searchText: string,
    wishItems: WishItemData[], activeGroups: ActiveGroup[]
) => {
    const propertyList: string[] = ["wishItems", "activeGroups", "filtered"];
    const responseSchema = {
        type: "object",
        properties: {
            wishItems: { type: ["string"] },
            activeGroups: { type: ["string"] },
            filtered: { type: ["boolean"] }
        },
        required: propertyList,
    }
    const simplifiedWishItems = wishItems.map((wi) => ({ id: wi.id, text: wi.text, targetPrice: wi.targetPrice, category: wi.categoryName }));
    const smartSearchPrompt: string =
        SMART_SEARCH_PROMPT.replace('{wishItems}', JSON.stringify(simplifiedWishItems))
            .replace('{activeGroups}', JSON.stringify(toPublicGroups(activeGroups)))
            .replace('{searchText}', searchText)
            .replace('{groupAmount}', SMART_SEARCH_GROUP_AMOUNT.toString());
    return { prompt: smartSearchPrompt, schema: responseSchema };
}
