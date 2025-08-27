import { Home, Grid3X3, Calendar, User } from "lucide-react";
import { Badge } from "../data-display/Badge.jsx";

export function BottomNavigation() {
  const navItems = [
    {
      icon: <Home className="size-5" />,
      label: "Home",
      isActive: true,
    },
    {
      icon: <Grid3X3 className="size-5" />,
      label: "Clubs",
    },
    {
      icon: <Calendar className="size-5" />,
      label: "Calendar",
      badge: 2,
    },
    {
      icon: <User className="size-5" />,
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center gap-1 relative ${
              item.isActive
                ? "text-[#2563EB]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              {item.isActive ? (
                <div className="p-1">{item.icon}</div>
              ) : (
                item.icon
              )}
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs min-w-5 h-5 flex items-center justify-center p-0">
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
