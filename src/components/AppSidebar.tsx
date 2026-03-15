import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  items: SidebarItem[];
  role: "provider" | "ngo" | "admin";
}

export const AppSidebar = ({ items, role }: AppSidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col bg-card border-r border-border h-screen sticky top-0 overflow-hidden"
    >
      <div className={cn("p-4 border-b border-border flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <Logo />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(item => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t border-border", collapsed && "flex justify-center")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-primary-foreground text-sm font-bold">
            {role === "ngo" ? "N" : role === "admin" ? "A" : "P"}
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-foreground">
                {role === "ngo" ? "NGO User" : role === "admin" ? "Admin" : "Provider"}
              </p>
              <p className="text-xs text-muted-foreground">
                {role}@nourishconnect.com
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
