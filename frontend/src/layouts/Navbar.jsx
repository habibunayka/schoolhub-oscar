import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@hooks/useAuth.js";
import useUnreadNotifications from "../hooks/useUnreadNotifications.js";

import {
  Avatar,
  Input,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/common/ui";
import SafeImage from "@components/SafeImage";
import authService from "@services/auth.js";
import { getAssetUrl } from "@utils";
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
  const auth = useAuth();
  const { data: user } = useQuery({
    queryKey: ["auth:me"],
    queryFn: authService.me,
  });
  const handleLogout = () => {
    auth?.logout?.();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <Avatar className="w-8 h-8">
            <SafeImage
              src={getAssetUrl(user?.avatar_url || user?.photo)}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
              sizePx={64}
            />
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

export default function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const unreadCount = useUnreadNotifications();

  return (
    <nav className="w-full bg-white/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-xl text-primary hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            SchoolHub
          </Link>
        </div>
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

    </nav>
  );
}
