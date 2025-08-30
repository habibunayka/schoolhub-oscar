import { NavLink } from "react-router-dom";
import { Home, Grid3X3, Calendar, Megaphone } from "lucide-react";

export function BottomNavigation() {
  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="size-5" />,
    },
    {
      to: "/clubs",
      label: "Clubs",
      icon: <Grid3X3 className="size-5" />,
    },
    {
      to: "/events",
      label: "Events",
      icon: <Calendar className="size-5" />,
    },
    {
      to: "/announcements",
      label: "Announcements",
      icon: <Megaphone className="size-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? "text-[#2563EB]"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
