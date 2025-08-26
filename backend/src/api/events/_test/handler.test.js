import * as Events from "../handler.js";

describe("events handler", () => {
    test("should expose required functions", () => {
        [
            "listEvents",
            "createEvent",
            "rsvpEvent",
            "reviewEvent",
            "checkinEvent",
        ].forEach((fn) => {
            expect(typeof Events[fn]).toBe("function");
        });
    });
});

