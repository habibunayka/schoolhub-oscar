import router from "../index.js";

describe("posts index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

