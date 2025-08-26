import router from "../index.js";

describe("clubs index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

