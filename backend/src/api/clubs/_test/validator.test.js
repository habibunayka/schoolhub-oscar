import {
    validateListClubs,
    validateCreateClub,
    validatePatchClub,
    validateJoinClub,
    validateSetMemberStatus,
    validatePatchHasFields,
} from "../validator.js";

describe("clubs validator", () => {
    test("validators should be arrays or functions", () => {
        [
            validateListClubs,
            validateCreateClub,
            validatePatchClub,
            validateJoinClub,
            validateSetMemberStatus,
        ].forEach((v) => expect(Array.isArray(v)).toBe(true));
        expect(typeof validatePatchHasFields).toBe("function");
    });
});

