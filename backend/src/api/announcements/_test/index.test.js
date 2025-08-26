import router from "../index.js";

describe("announcements index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

