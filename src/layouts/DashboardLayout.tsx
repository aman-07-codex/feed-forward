import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { LucideIcon, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
  items: { label: string; href: string; icon: LucideIcon }[];
  role: "provider" | "ngo" | "admin";
}

export const DashboardLayout = ({ children, items, role }: DashboardLayoutProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background w-full">
      <AppSidebar items={items} role={role} />
      
      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
        <div className="flex justify-around py-2">
          {items.slice(0, 5).map(item => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};
