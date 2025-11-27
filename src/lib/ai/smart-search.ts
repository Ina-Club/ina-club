import { ActiveGroup, RequestGroup } from "@/lib/dal";
import { SMART_SEARCH_PROMPT } from "@/ai/prompts";
import { toPublicGroups } from "@/lib/transformers/group";
import { filterGroupsByIds } from "@/lib/groups";
import { sendRequestToAi } from "@/lib/ai/ai";
import { SMART_SEARCH_GROUP_AMOUNT } from "@/app/config/smart-search";

export const aiFilteredGroups = async (activeGroups: ActiveGroup[], requestGroups: RequestGroup[], searchText: string) => {
    const { prompt, schema } = buildSmartSearchRequest(searchText, requestGroups, activeGroups);
    const aiResponse: any = await sendRequestToAi(prompt, schema);
    const data: any = JSON.parse(aiResponse);
    const filteredActiveGroups: ActiveGroup[] = filterGroupsByIds(activeGroups, data.activeGroups) as ActiveGroup[];
    const filteredRequestGroups: RequestGroup[] = filterGroupsByIds(requestGroups, data.requestGroups) as RequestGroup[];
    return { relevantActiveGroups: filteredActiveGroups, relevantRequestGroups: filteredRequestGroups, filtered: data.filtered };
}

const buildSmartSearchRequest = (searchText: string,
    requestGroups: RequestGroup[], activeGroups: ActiveGroup[]
) => {
    const propertyList: string[] = ["requestGroups", "activeGroups", "filtered"];
    const responseSchema = {
        type: "object",
        properties: {
            requestGroups: { type: ["string"] },
            activeGroups: { type: ["string"] },
            filtered: { type: ["boolean"] }
        },
        required: propertyList,
    }
    const smartSearchPrompt: string =
        SMART_SEARCH_PROMPT.replace('{requestGroups}', JSON.stringify(toPublicGroups(requestGroups)))
            .replace('{activeGroups}', JSON.stringify(toPublicGroups(activeGroups)))
            .replace('{searchText}', searchText)
            .replace('{groupAmount}', SMART_SEARCH_GROUP_AMOUNT.toString());
    return { prompt: smartSearchPrompt, schema: responseSchema };
}
