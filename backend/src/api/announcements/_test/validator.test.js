import {
    validateGetAllAnnouncements,
    validateGetAnnouncementById,
    validateCreateAnnouncement,
} from "../validator.js";

describe("announcements validator", () => {
    test("validators should be arrays", () => {
        [
            validateGetAllAnnouncements,
            validateGetAnnouncementById,
            validateCreateAnnouncement,
        ].forEach((v) => expect(Array.isArray(v)).toBe(true));
    });
});

