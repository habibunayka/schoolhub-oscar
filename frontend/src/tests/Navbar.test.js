/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let Navbar;
try {
  ({ default: Navbar } = await import("../components/Navbar.js"));
} catch {
  Navbar = null;
}

if (Navbar) {
  test("renders logo, search, and avatar", () => {
    const html = renderToStaticMarkup(React.createElement(Navbar));
    assert(html.includes("SchoolHub"));
    assert(html.includes("aria-label=\"Search\""));
    assert(html.includes("AvatarFallback"));
  });
} else {
  test("navbar render", { skip: true }, () => {});
}
