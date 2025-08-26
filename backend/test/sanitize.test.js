import test from "node:test";
import assert from "node:assert";

import { cleanHTML } from "../src/services/sanitize.js";

test("cleanHTML removes disallowed tags", () => {
    const dirty = "<p>Hello<script>alert('x')</script></p>";
    const cleaned = cleanHTML(dirty);
    assert.equal(cleaned, "<p>Hello</p>");
});

