import * as Admin from "../handler.js";

describe("admin handler", () => {
    test("should expose takedown", () => {
        expect(typeof Admin.takedown).toBe("function");
    });
});

