import * as Auth from "../handler.js";

describe("auth handler", () => {
    test("should expose login and register", () => {
        expect(typeof Auth.login).toBe("function");
        expect(typeof Auth.register).toBe("function");
    });
});

