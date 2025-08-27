/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClubListPage from "../ClubListPage.jsx";
import { api } from "../../../lib/api/apiClient.js";

function setupDom() {
  const rootElem = {
    nodeType: 1,
    nodeName: "DIV",
    ownerDocument: null,
    appendChild(child) {
      this.child = child;
    },
    removeChild() {
      this.child = null;
    },
    addEventListener() {},
    removeEventListener() {},
    get textContent() {
      return this.child?.textContent || "";
    },
  };
  const document = {
    createElement: () => rootElem,
  };
  rootElem.ownerDocument = document;
  globalThis.document = document;
  globalThis.window = { document };
  return rootElem;
}

test.skip("ClubListPage renders clubs", async () => {
  api.get = async () => ({
    data: [{ id: 1, name: "Chess Club", memberCount: 0 }],
  });
  const container = setupDom();
  const root = createRoot(container);
  const queryClient = new QueryClient();
  await act(async () => {
    root.render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(ClubListPage, null),
      ),
    );
  });
  await new Promise((r) => setTimeout(r, 0));
  assert.match(container.textContent, /Chess Club/);
});
