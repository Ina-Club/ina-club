export const getUserIdBySession = async () => {
    const response = await fetch("/api/user");
    if (!response.ok) {
        throw new Error("שגיאה בחיפוש");
    }
    const data = await response.json();
    return data.id;
}