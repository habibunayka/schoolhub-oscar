import {
    validateCreatePost,
    validateListPosts,
    validateGetPostById,
} from "../validator.js";

describe("posts validator", () => {
    test("validators should be arrays", () => {
        [validateCreatePost, validateListPosts, validateGetPostById].forEach(
            (v) => expect(Array.isArray(v)).toBe(true)
        );
    });
});

