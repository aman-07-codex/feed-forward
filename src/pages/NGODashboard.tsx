import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { LayoutDashboard, Search, Package, History, User, Utensils, HandHeart, Award, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
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

export default function NGODashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [available, setAvailable] = useState<any[]>([]);
  const [stats, setStats] = useState({ availableNearby: 0, foodClaimed: 0, mealsDistributed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Fetch available food
      const { data: foodData, error: foodError } = await supabase
        .from("food_posts")
        .select("*, profiles (organization_name)")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(6);

      if (foodError) throw foodError;

      // Fetch claims for this NGO
      const { data: claimsData, error: claimsError } = await supabase
        .from("claims")
        .select("*, food_posts(serves_count, status)")
        .eq("ngo_id", user.id);

      if (claimsError) throw claimsError;

      const foodClaimed = claimsData?.length || 0;
      const mealsDistributed = claimsData?.reduce((sum, c) => sum + (c.food_posts?.serves_count || 0), 0) || 0;

      setAvailable(foodData || []);
      setStats({
        availableNearby: foodData?.length || 0,
        foodClaimed,
        mealsDistributed,
      });
    } catch (error) {
      console.error("Error fetching NGO dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleClaim = async (foodId: string) => {
    if (!user) return;
    try {
      const { error: claimError } = await supabase
        .from("claims")
        .insert([{ food_id: foodId, ngo_id: user.id }]);
      if (claimError) throw claimError;

      const { error: updateError } = await supabase
        .from("food_posts")
        .update({ status: "claimed" })
        .eq("id", foodId);
      if (updateError) throw updateError;

      setShowConfetti(true);
      setAvailable(prev => prev.filter(f => f.id !== foodId));
      setStats(prev => ({ ...prev, foodClaimed: prev.foodClaimed + 1, availableNearby: prev.availableNearby - 1 }));
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to claim food.");
    }
  };

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
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
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground">Food Claimed!</h3>
              <p className="text-sm text-muted-foreground mt-2">Coordinate pickup with the provider.</p>
              <button onClick={() => { setShowConfetti(false); navigate("/ngo/claimed"); }} className="mt-6 w-full py-3 rounded-xl font-medium gradient-green text-primary-foreground shadow-green">
                View Claimed Food
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar title="NGO Dashboard" subtitle={`${stats.availableNearby} active donations in your service area.`} />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <DashboardCard label="Available Nearby" value={stats.availableNearby} icon={Utensils} color="green" />
            <DashboardCard label="Food Claimed" value={stats.foodClaimed} icon={HandHeart} color="amber" />
            <DashboardCard label="Meals Distributed" value={stats.mealsDistributed.toLocaleString()} icon={Award} color="blue" />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Available Food</h2>
            <Link to="/ngo/available" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>

          {available.length === 0 ? (
            <div className="matte-card rounded-2xl p-12 text-center flex flex-col items-center">
              <Search className="text-muted-foreground/30 mb-4" size={48} />
              <h3 className="text-xl font-bold text-foreground">No food available right now</h3>
              <p className="text-sm text-muted-foreground mt-2">Check back later for new surplus food donations.</p>
            </div>
          ) : (
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
          )}
        </>
      )}
    </DashboardLayout>
  );
}
