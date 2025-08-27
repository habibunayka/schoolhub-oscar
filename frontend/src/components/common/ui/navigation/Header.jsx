import { Search, Bell, Menu, LogOut } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Avatar, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function Header({ showSearch = true, showProfile = true, onLogout }) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SH</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">
                SchoolHub
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="hover:text-[#2563EB] transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">
              Clubs
            </a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">
              Events
            </a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">
              About
            </a>
          </nav>

          {/* Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Cari ekstrakurikuler..."
                  className="pl-10 bg-input-background border-0"
                />
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search Icon (Mobile) */}
            {showSearch && (
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="size-5" />
              </Button>
            )}

            {showProfile ? (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="size-5" />
                  <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#2563EB] text-white">
                          AN
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost">Login</Button>
                <Button className="bg-[#2563EB] hover:bg-blue-700">
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
