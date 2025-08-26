import * as Announcements from "../handler.js";

describe("announcements handler", () => {
    test("should expose required functions", () => {
        [
            "getAllAnnouncements",
            "getAnnouncementById",
            "createAnnouncement",
        ].forEach((fn) => {
            expect(typeof Announcements[fn]).toBe("function");
        });
    });
});

