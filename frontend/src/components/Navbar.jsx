import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Input,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@components/common/ui';
import clubs from '@lib/api/services/clubs';

function GlobalSearch() {
  const timer = useRef();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
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
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <form className="w-full" onSubmit={onSubmit}>
      <Input
        aria-label="Search"
        placeholder="Search..."
        value={query}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
      />
    </form>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
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
        <DropdownMenuItem asChild>
          <Link to="/logout">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-primary">
            SchoolHub
          </Link>
        </div>
        <div className="flex-1 max-w-md hidden md:block">
          <GlobalSearch />
        </div>
        {mobileSearchOpen && (
          <div className="absolute left-0 right-0 top-full p-4 md:hidden bg-white dark:bg-slate-900 border-b border-border">
            <GlobalSearch />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((s) => !s)}
          >
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
