import router from "../index.js";

describe("events index", () => {
    test("should export router", () => {
        expect(typeof router).toBe("function");
    });
});

