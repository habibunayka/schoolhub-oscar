import { validateTakedown } from "../validator.js";

describe("admin validator", () => {
    test("validator should be array", () => {
        expect(Array.isArray(validateTakedown)).toBe(true);
    });
});

