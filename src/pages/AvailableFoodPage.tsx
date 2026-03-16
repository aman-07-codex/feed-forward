import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { LayoutDashboard, Search, Package, History, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
  { label: "Available", href: "/ngo/available", icon: Search },
  { label: "Claimed", href: "/ngo/claimed", icon: Package },
  { label: "History", href: "/ngo/dashboard", icon: History },
  { label: "Profile", href: "/ngo/dashboard", icon: User },
];

export default function AvailableFoodPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableFood, setAvailableFood] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailableFood = async () => {
    try {
      const { data, error } = await supabase
        .from("food_posts")
        .select(`
          *,
          profiles (organization_name)
        `)
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAvailableFood(data || []);
    } catch (error) {
      console.error("Error fetching available food:", error);
      toast.error("Failed to load available food.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const handleClaim = async (foodId: string) => {
    if (!user) return;
    try {
      // 1. Insert claim
      const { error: claimError } = await supabase
        .from("claims")
        .insert([{ food_id: foodId, ngo_id: user.id }]);

      if (claimError) throw claimError;

      // 2. Update food post status
      const { error: updateError } = await supabase
        .from("food_posts")
        .update({ status: "claimed" })
        .eq("id", foodId);

      if (updateError) throw updateError;

      setShowSuccess(true);
      // Remove the claimed item from the list
      setAvailableFood(prev => prev.filter(f => f.id !== foodId));

    } catch (error: any) {
      console.error("Error claiming food:", error);
      toast.error(error.message || "Failed to claim food. It might have already been claimed.");
    }
  };

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowSuccess(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="matte-card rounded-3xl p-10 text-center max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground">Food Claimed!</h3>
              <p className="text-sm text-muted-foreground mt-2">Coordinate pickup with the provider.</p>
              <button 
                className="mt-6 w-full py-3 rounded-xl font-medium gradient-green text-primary-foreground shadow-green"
                onClick={() => { setShowSuccess(false); navigate("/ngo/claimed"); }}
              >
                View Claimed Food
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar title="Available Food" subtitle="Browse and claim surplus food near you." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "Cooked Food", "Raw Ingredients", "Packaged Food", "Bakery Items", "Beverages", "Fruits & Vegetables"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "gradient-green text-primary-foreground shadow-green" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : availableFood.length === 0 ? (
        <div className="matte-card rounded-2xl p-12 text-center flex flex-col items-center">
          <Search className="text-muted-foreground/30 mb-4" size={48} />
          <h3 className="text-xl font-bold text-foreground">No food available right now</h3>
          <p className="text-sm text-muted-foreground mt-2">Check back later for new surplus food donations in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableFood
            .filter(item => filter === "all" || item.food_type === filter)
            .map(item => (
              <FoodCard
                key={item.id}
                data={item}
                showActions
                onClaim={() => handleClaim(item.id)}
                onView={() => navigate(`/ngo/food/${item.id}`)}
              />
            ))}
        </div>
      )}
    </DashboardLayout>
  );
}
