export const SMART_SEARCH_PROMPT: string =
    `
    You are a software engineering expert which is also great at associations.
    I want you to run over 2 lists:
    1. requestGroups list: {requestGroups}
    2. activeGroups list: {activeGroups}
    Since I am sending you an HTTP request, the return type you should hand me is provided to you in the schema property of the request's body. 
    I want you to run over all the elements in both lists and filter out all elements except the one that any of their properties have a reasonable connection to {searchText}.
    From the remaining group items, insert ONLY their id's to the relevant array that should be returned and is defined in your responseSchema.
    For example, if you found 1 requestGroup that match the provided text, and assuming we can call the object rg, the requestGroups key of the returned object should have a value of [rg.id], and activeGroups should have value of [].
    If you can't find any connection, return for both properties empty arrays.
    For any other problem you face that prevents you from returning the exact response structure that I asked for, return an empty object.
    `
