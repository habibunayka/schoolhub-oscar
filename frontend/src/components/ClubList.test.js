import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from '../lib/queryClient.js';
import { ClubList } from './ClubList.js';

function setupDom() {
  const rootElem = {
    nodeType: 1,
    nodeName: 'DIV',
    ownerDocument: null,
    appendChild(child) { this.child = child; },
    removeChild() { this.child = null; },
    addEventListener() {},
    removeEventListener() {},
    get textContent() { return this.child?.textContent || ''; },
  };
  const document = {
    createElement: () => rootElem,
  };
  rootElem.ownerDocument = document;
  global.document = document;
  global.window = { document };
  return rootElem;
}

test.skip('ClubList renders clubs', async () => {
  global.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => [{ id: 1, name: 'Chess Club', memberCount: 0 }],
  });
  const container = setupDom();
  const root = createRoot(container);
  await act(async () => {
    root.render(
      React.createElement(
        QueryProvider,
        null,
        React.createElement(ClubList, null)
      )
    );
  });
  await new Promise((r) => setTimeout(r, 0));
  assert.match(container.textContent, /Chess Club/);
});
