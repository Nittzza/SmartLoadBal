
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  LineChart,
  Zap,
  LogOut,
  Activity
} from "lucide-react";

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const location = useLocation();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      active: location.pathname === "/",
      icon: LayoutDashboard
    },
    {
      href: "/appliances",
      label: "Appliances",
      active: location.pathname === "/appliances",
      icon: Zap
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: location.pathname === "/analytics",
      icon: LineChart
    },
    {
      href: "/traffic",
      label: "Traffic Management",
      active: location.pathname === "/traffic",
      icon: Activity
    },
    {
      href: "/settings",
      label: "Settings",
      active: location.pathname === "/settings",
      icon: Settings
    },
  ];

  return (
    <div className={cn("flex flex-col space-y-6", className)}>
      <div className="flex items-center space-x-2 px-6 py-4">
        <Zap className="h-8 w-8 text-energy-blue" />
        <span className="font-bold text-xl">SmartLoadBalancer</span>
      </div>
      <div className="space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md transition-colors",
              route.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="mt-auto px-3 py-2">
        <button className="flex w-full items-center gap-x-2 text-sm font-medium px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
