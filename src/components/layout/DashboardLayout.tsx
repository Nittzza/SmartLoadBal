
import React from "react";
import SidebarNav from "./SidebarNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HelpCircle, 
  Bell, 
  Settings, 
  UserCircle 
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 hidden md:flex flex-col border-r bg-card">
        <SidebarNav className="flex-1" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with user info and icons */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          {/* Left side of header (can be used later if needed) */}
          <div></div>
          
          {/* Right side with icons and user info */}
          <div className="flex items-center gap-4">
            <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent">
              <HelpCircle className="h-5 w-5" />
            </Link>
            
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <Link to="/settings" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent">
              <Settings className="h-5 w-5" />
            </Link>
            
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm font-medium">Demo User</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>DU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
