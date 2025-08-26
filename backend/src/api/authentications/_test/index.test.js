import router from "../index.js";

describe("auth index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

