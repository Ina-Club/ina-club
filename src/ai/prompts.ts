export const SMART_SEARCH_PROMPT: string =
    `
    Generate a JSON object for a {productName}.
    You are a market researcher expert that is familiar with all kinds of products.
    I want you to conduct a research about {productName}.
    Search about each of the properties provided in the following list: {propertyList}.
    When you finish I want you to deliver me the output as followed:
    Return a JSON object that represents an item where each detail is presented as a field in the object.
    Couple of things to keep in mide: if a specific model is provided, search for its price online and present an average price range.
    If no specific model is provided, select the highest-rated product in that category, perform a full price analysis for it, and present the information in JSON format.
    All string-type details should be written in Hebrew and related to Israel (For example, 'average price' property is based on different websites in Israel and in ILS).
    For prices, don't include the unit or the sign of ILS, just make sure the number is in the right ILS amount.
    Also, prices should be rounded to the nearest integer.
    If any of the specified fields are invalid/not found/not available for some reason and you think that you might provide false information, return an empty Dict.
    `
