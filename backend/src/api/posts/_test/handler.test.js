import * as Posts from "../handler.js";

describe("posts handler", () => {
    test("should expose required functions", () => {
        ["listPosts", "getPostById", "createPost"].forEach((fn) => {
            expect(typeof Posts[fn]).toBe("function");
        });
    });
});

