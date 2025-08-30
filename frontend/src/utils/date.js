export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    return date.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

export const formatDateOnly = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const formatDate = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });
};

export const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
