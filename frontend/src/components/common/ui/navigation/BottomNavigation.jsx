import { Home, Grid3X3, Calendar, Megaphone } from "lucide-react";
import { NavLink } from "react-router-dom";

export function BottomNavigation() {
  const navItems = [
    {
      to: "/",
      icon: <Home className="size-5" />,
      label: "Home",
    },
    {
      to: "/clubs",
      icon: <Grid3X3 className="size-5" />,
      label: "Clubs",
    },
    {
      to: "/events",
      icon: <Calendar className="size-5" />,
      label: "Events",
    },
    {
      to: "/announcements",
      icon: <Megaphone className="size-5" />,
      label: "Announcements",
    },
  ];

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 relative ${
                isActive
                  ? "text-[#2563EB]"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <div className="p-1">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
