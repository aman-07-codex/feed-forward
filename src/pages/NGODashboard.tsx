import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { MOCK_FOOD_DATA, MOCK_NGO_STATS } from "@/lib/mock-data";
import { LayoutDashboard, Search, Package, History, User, Utensils, HandHeart, Award } from "lucide-react";
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

const NGODashboard = () => {
  const navigate = useNavigate();
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const available = MOCK_FOOD_DATA.filter(f => f.status === "available");

  const handleClaim = (id: string) => {
    setClaimedId(id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowConfetti(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="matte-card rounded-3xl p-10 text-center max-w-sm"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground">Food Claimed!</h3>
              <p className="text-sm text-muted-foreground mt-2">Coordinate pickup with the provider.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar title="NGO Dashboard" subtitle={`${available.length} active donations in your service area.`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard label="Available Nearby" value={MOCK_NGO_STATS.availableNearby} icon={Utensils} color="green" />
        <DashboardCard label="Food Claimed" value={MOCK_NGO_STATS.foodClaimed} icon={HandHeart} trend="+5 today" color="amber" />
        <DashboardCard label="Meals Distributed" value={MOCK_NGO_STATS.mealsDistributed.toLocaleString()} icon={Award} trend="+18%" color="blue" />
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Available Food</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {available.map(item => (
          <FoodCard
            key={item.id}
            data={item}
            showActions
            onClaim={() => handleClaim(item.id)}
            onView={() => navigate(`/ngo/food/${item.id}`)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;
