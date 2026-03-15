import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TopBar = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 w-48"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors relative"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-emergency text-[10px] text-primary-foreground flex items-center justify-center font-bold">3</span>
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-72 matte-card rounded-xl p-3 z-50"
              >
                {["New food available nearby!", "Your donation was claimed", "Pickup confirmed for 2PM"].map((n, i) => (
                  <div key={i} className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <p className="text-sm text-foreground">{n}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{i + 1}h ago</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-primary-foreground font-bold text-sm">
          U
        </div>
      </div>
    </header>
  );
};
