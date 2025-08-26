import {
    validateListEvents,
    validateCreateEvent,
    validateRsvpEvent,
    validateCheckinEvent,
    validateReviewEvent,
} from "../validator.js";

describe("events validator", () => {
    test("validators should be arrays", () => {
        [
            validateListEvents,
            validateCreateEvent,
            validateRsvpEvent,
            validateCheckinEvent,
            validateReviewEvent,
        ].forEach((v) => expect(Array.isArray(v)).toBe(true));
    });
});

