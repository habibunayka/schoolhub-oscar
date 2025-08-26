import router from "../index.js";

describe("admin index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

