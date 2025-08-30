import { cleanHTML } from '../src/services/sanitize.js';

test('cleanHTML removes disallowed tags', () => {
  const dirty = "<p>Hello<script>alert('x')</script></p>";
  const cleaned = cleanHTML(dirty);
  expect(cleaned).toBe('<p>Hello</p>');
});
