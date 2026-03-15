import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { MOCK_FOOD_DATA } from "@/lib/mock-data";
import { LayoutDashboard, Search, Package, History, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
  { label: "Available", href: "/ngo/available", icon: Search },
  { label: "Claimed", href: "/ngo/claimed", icon: Package },
  { label: "History", href: "/ngo/dashboard", icon: History },
  { label: "Profile", href: "/ngo/dashboard", icon: User },
];

const AvailableFoodPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const available = MOCK_FOOD_DATA.filter(f => f.status === "available");

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowSuccess(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="matte-card rounded-3xl p-10 text-center max-w-sm">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground">Food Claimed!</h3>
              <p className="text-sm text-muted-foreground mt-2">Coordinate pickup with the provider.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar title="Available Food" subtitle="Browse and claim surplus food near you." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "Cooked", "Bakery", "Fresh", "Packaged", "Beverage"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "gradient-green text-primary-foreground shadow-green" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {available
          .filter(item => filter === "all" || item.type === filter)
          .map(item => (
            <FoodCard
              key={item.id}
              data={item}
              showActions
              onClaim={() => { setClaimedId(item.id); setShowSuccess(true); }}
              onView={() => navigate(`/ngo/food/${item.id}`)}
            />
          ))}
      </div>
    </DashboardLayout>
  );
};

export default AvailableFoodPage;
