import sanitizeHtml from "sanitize-html";
export const cleanHTML = (html) =>
    sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "video",
            "source",
            "code",
            "pre",
        ]),
        allowedAttributes: {
            "*": ["href", "src", "alt", "title", "class", "style"],
        },
        allowedSchemes: ["http", "https", "data"],
    });
