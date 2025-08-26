import * as Clubs from "../handler.js";

describe("clubs handler", () => {
    test("should expose required functions", () => {
        [
            "listClubs",
            "createClub",
            "patchClub",
            "joinClub",
            "setMemberStatus",
        ].forEach((fn) => {
            expect(typeof Clubs[fn]).toBe("function");
        });
    });
});

