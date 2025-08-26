import { loginValidator, registerValidator } from "../validator.js";

describe("auth validator", () => {
    test("validators should be arrays", () => {
        [loginValidator, registerValidator].forEach((v) =>
            expect(Array.isArray(v)).toBe(true)
        );
    });
});

