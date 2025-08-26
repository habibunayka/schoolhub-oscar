import { validateListNotifications } from "../validator.js";

describe("notifications validator", () => {
    test("validator should be array", () => {
        expect(Array.isArray(validateListNotifications)).toBe(true);
    });
});

