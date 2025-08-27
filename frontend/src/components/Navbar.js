import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@components/ui/dropdown-menu";
import clubs from "@lib/api/services/clubs";

function GlobalSearch() {
  const timer = useRef();
  const onChange = (e) => {
    const value = e.target.value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (value) clubs.listClubs({ search: value }).catch(() => {});
    }, 300);
  };
  return _jsx("form", {
    className: "w-full",
    onSubmit: (e) => e.preventDefault(),
    children: _jsx(Input, {
      "aria-label": "Search",
      placeholder: "Search...",
      onChange: onChange,
      onFocus: (e) => e.target.select(),
    }),
  });
}

function UserMenu() {
  return _jsx(DropdownMenu, {
    children: _jsxs(DropdownMenuTrigger, {
      asChild: true,
      children: [
        _jsx(Button, {
          variant: "ghost",
          className: "w-8 h-8 p-0",
          children: _jsx(Avatar, {
            className: "w-8 h-8",
            children: _jsx(AvatarFallback, { children: "U" }),
          }),
        }),
        _jsx(DropdownMenuContent, {
          align: "end",
          children: _jsxs(React.Fragment, {
            children: [
              _jsx(DropdownMenuItem, {
                asChild: true,
                children: _jsx(Link, { to: "/profile", children: "Profile" }),
              }),
              _jsx(DropdownMenuItem, {
                asChild: true,
                children: _jsx(Link, { to: "/settings", children: "Settings" }),
              }),
              _jsx(DropdownMenuItem, {
                asChild: true,
                children: _jsx(Link, { to: "/logout", children: "Logout" }),
              }),
            ],
          }),
        }),
      ],
    }),
  });
}

export default function Navbar() {
  return _jsx("nav", {
    className: "flex items-center justify-between p-4 gap-4",
    children: _jsxs(React.Fragment, {
      children: [
        _jsx("div", {
          className: "flex items-center",
          children: _jsx(Link, { to: "/", className: "font-bold", children: "SchoolHub" }),
        }),
        _jsx("div", { className: "flex-1 max-w-md", children: _jsx(GlobalSearch, {}) }),
        _jsx("div", { className: "flex items-center", children: _jsx(UserMenu, {}) }),
      ],
    }),
  });
}
