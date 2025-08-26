import router from "../index.js";

describe("notifications index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

