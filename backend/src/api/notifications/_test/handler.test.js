import * as Notifications from "../handler.js";

describe("notifications handler", () => {
    test("should expose listNotifications", () => {
        expect(typeof Notifications.listNotifications).toBe("function");
    });
});

