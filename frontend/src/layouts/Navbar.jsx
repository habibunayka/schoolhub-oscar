import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, X } from "lucide-react";
import { useAuth } from "@hooks/useAuth.js";
import useUnreadNotifications from "../hooks/useUnreadNotifications.js";

import {
  Avatar,
  AvatarFallback,
  Input,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/common/ui";
import clubs from "@services/clubs.js";
function GlobalSearch() {
  const timer = useRef();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (value) clubs.listClubs({ search: value }).catch(() => {});
    }, 300);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className="w-full relative group" onSubmit={onSubmit}>
      {/* Search button (icon di kiri) */}
      <button
        type="submit"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 
                   flex items-center justify-center text-gray-400 
                   hover:bg-gray-200 rounded-md transition"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Input */}
      <Input
        aria-label="Search"
        placeholder="Search Club..."
        value={query}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        className="pl-9 pr-3 focus-visible:ring-1 ml-0.5 focus-visible:ring-blue-500 focus-visible:border-blue-500"
      />
    </form>
  );
}


function UserMenu() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavMenu({ isOpen, onClose }) {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
    { to: "/announcements", label: "Announcements" },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-border md:hidden z-40">
      <div className="px-4 py-2 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive
                  ? "text-primary bg-gray-100"
                  : "text-gray-700 hover:text-black hover:bg-primary hover:shadow-md hover:scale-[1.02]"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function DesktopNavLinks() {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
    { to: "/announcements", label: "Announcements" },
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `relative text-sm font-medium transition-all duration-200 border-b-2 ${
              isActive
                ? "text-primary border-primary"
                : "text-gray-700 border-transparent hover:text-primary hover:border-primary/70"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unreadCount = useUnreadNotifications();

  return (
    <nav className="w-full bg-white/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200 rounded-lg"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? (
              <X className="size-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="size-5 transition-transform duration-200" />
            )}
          </Button>

          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-xl text-primary hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            SchoolHub
          </Link>
        </div>

        {/* Desktop navigation links */}
        <DesktopNavLinks />

        {/* Search bar (desktop) */}
        <div className="flex-1 max-w-md hidden md:block">
          <GlobalSearch />
        </div>

        {/* Mobile search overlay */}
        {mobileSearchOpen && (
          <div className="absolute left-0 right-0 top-full p-4 md:hidden bg-white border-b border-border z-40">
            <GlobalSearch />
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200 rounded-lg"
            onClick={() => setMobileSearchOpen((s) => !s)}
          >
            <Search className="size-5" />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-200 transition-all duration-200 rounded-lg transform"
          >
            <Link to="/notifications">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>

      {/* Mobile navigation menu */}
      <MobileNavMenu
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </nav>
  );
}
