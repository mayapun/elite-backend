export function formatDate(dateString?: string){
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}