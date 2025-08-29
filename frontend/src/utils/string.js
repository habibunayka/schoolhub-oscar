// src/utils/string.js
export function getInitials(name = "") {
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  }
  