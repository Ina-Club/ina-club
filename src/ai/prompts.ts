export const PRICE_ANALYZER_PROMPT: string =
    `
    Generate a JSON object for a {productName}.
    If a specific model is provided, search for its price online and present an average price range.
    If no specific model is provided, select the highest-rated product in that category, perform a full price analysis for it, and present the information in JSON format.
    The final output should include the following details: {propertyList}.
    Return an object for an item with the average price across different websites in Israel.
    The price should be in ILS. if in the items there is no a spesific model return the higest rated item for the same family.
    `
