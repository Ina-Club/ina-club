import { ActiveGroup, RequestGroup } from "@/lib/dal";
import { SMART_SEARCH_PROMPT } from "@/ai/prompts";
import { toPublicGroups } from "@/lib/transformers/group";
import { filterGroupsByIds } from "@/lib/groups";
import { sendRequestToAi } from "@/lib/ai/ai";

export const aiFilteredGroups = async (activeGroups: ActiveGroup[], requestGroups: RequestGroup[], searchText: string) => {
    const { prompt, schema } = buildSmartSearchRequest(searchText, requestGroups, activeGroups);
    const aiResponse: any = await sendRequestToAi(prompt, schema);
    const data: any = JSON.parse(aiResponse);
    if (data?.activeGroups == undefined || data?.requestGroups == undefined) {
        console.log(aiResponse);
        throw new Error("Invalid response from AI!");
    }
    const filteredActiveGroups: ActiveGroup[] = filterGroupsByIds(activeGroups, data.activeGroups) as ActiveGroup[];
    const filteredRequestGroups: RequestGroup[] = filterGroupsByIds(requestGroups, data.requestGroups) as RequestGroup[];
    return { relevantActiveGroups: filteredActiveGroups, relevantRequestGroups: filteredRequestGroups };
}

const buildSmartSearchRequest = (searchText: string,
    requestGroups: RequestGroup[], activeGroups: ActiveGroup[]
) => {
    const propertyList: string[] = ["requestGroups", "activeGroups"];
    const responseSchema = {
        type: "object",
        properties: {
            requestGroups: { type: ["string"] },
            activeGroups: { type: ["string"] },
        },
        required: propertyList,
    }
    const smartSearchPrompt: string =
        SMART_SEARCH_PROMPT.replace('{requestGroups}', JSON.stringify(toPublicGroups(requestGroups)))
            .replace('{activeGroups}', JSON.stringify(toPublicGroups(activeGroups)))
            .replace('{searchText}', searchText);
    return { prompt: smartSearchPrompt, schema: responseSchema };
}
