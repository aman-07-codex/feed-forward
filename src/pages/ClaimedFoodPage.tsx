import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { LayoutDashboard, Search, Package, History, User, Loader2 } from "lucide-react";
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

export default function ClaimedFoodPage() {
  const { user } = useAuth();
  const [claimedFood, setClaimedFood] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClaimedFood = async () => {
      try {
        // Fetch claims for this NGO, join with food_posts and provider profiles
        const { data, error } = await supabase
          .from("claims")
          .select(`
            *,
            food_posts (
              *,
              profiles:provider_id (
                organization_name
              )
            )
          `)
          .eq("ngo_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Flatten the data structure somewhat to match FoodCard expectations
        const formattedData = data?.map(claim => ({
          ...claim.food_posts,
          claim_status: claim.status,
          claim_id: claim.id
        })) || [];

        setClaimedFood(formattedData);
      } catch (error) {
        console.error("Error fetching claimed food:", error);
        toast.error("Failed to load your claimed food.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedFood();
  }, [user]);

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <TopBar title="Claimed Food" subtitle="Food you've claimed for pickup." />
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : claimedFood.length === 0 ? (
        <div className="matte-card rounded-2xl p-12 text-center flex flex-col items-center">
          <Package className="text-muted-foreground/30 mb-4" size={48} />
          <h3 className="text-xl font-bold text-foreground">No claimed food</h3>
          <p className="text-sm text-muted-foreground mt-2">You haven't claimed any surplus food yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {claimedFood.map(item => (
            <FoodCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
