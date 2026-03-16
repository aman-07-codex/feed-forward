import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ActionButton } from "@/components/ActionButton";
import { StatusBadge } from "@/components/StatusBadge";
import { LayoutDashboard, Search, Package, History, User, MapPin, Clock, Users, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

const sidebarItems = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
  { label: "Available", href: "/ngo/available", icon: Search },
  { label: "Claimed", href: "/ngo/claimed", icon: Package },
  { label: "History", href: "/ngo/dashboard", icon: History },
  { label: "Profile", href: "/ngo/dashboard", icon: User },
];

export default function FoodDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const { data, error } = await supabase
          .from("food_posts")
          .select(`
            *,
            profiles (organization_name, phone, full_name)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setFood(data);
      } catch (error) {
        console.error("Error fetching food detail:", error);
        toast.error("Failed to load food details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFood();
  }, [id]);

  const handleClaim = async () => {
    if (!user || !food) return;
    setClaiming(true);
    try {
      const { error: claimError } = await supabase
        .from("claims")
        .insert([{ food_id: food.id, ngo_id: user.id }]);
      if (claimError) throw claimError;

      const { error: updateError } = await supabase
        .from("food_posts")
        .update({ status: "claimed" })
        .eq("id", food.id);
      if (updateError) throw updateError;

      setFood({ ...food, status: "claimed" });
      toast.success("Food claimed successfully! Coordinate pickup with the provider.");
    } catch (error: any) {
      toast.error(error.message || "Failed to claim food.");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout items={sidebarItems} role="ngo">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (!food) {
    return (
      <DashboardLayout items={sidebarItems} role="ngo">
        <div className="flex flex-col h-64 items-center justify-center text-center">
          <h3 className="text-xl font-bold text-foreground">Food not found</h3>
          <Link to="/ngo/available" className="text-primary font-medium hover:underline mt-4">Browse available food</Link>
        </div>
      </DashboardLayout>
    );
  }

  const timeLeft = food.pickup_deadline ? formatDistanceToNow(new Date(food.pickup_deadline), { addSuffix: true }) : "N/A";

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <Link to="/ngo/available" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Back to available food
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 matte-card rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{food.food_name}</h1>
              <p className="text-muted-foreground mt-1">{food.profiles?.organization_name || "Unknown Provider"}</p>
            </div>
            <StatusBadge status={food.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Servings", value: food.serves_count },
              { icon: Package, label: "Quantity", value: food.quantity },
              { icon: Clock, label: "Deadline", value: timeLeft },
              { icon: MapPin, label: "Location", value: food.pickup_location },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-muted/50 text-center">
                <item.icon size={20} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-lg font-bold text-foreground truncate">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {food.notes && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">{food.notes}</p>
            </div>
          )}

          {/* Map placeholder */}
          <div className="rounded-2xl bg-muted h-48 flex items-center justify-center border border-border">
            <div className="text-center">
              <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Map preview — {food.pickup_location}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="matte-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Provider Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <User size={16} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{food.profiles?.organization_name || food.profiles?.full_name || "Provider"}</p>
                  <p className="text-xs text-muted-foreground">Verified provider</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Phone size={16} className="text-accent-foreground" />
                </div>
                <p className="text-muted-foreground">{food.profiles?.phone || "Contact via platform"}</p>
              </div>
            </div>
          </div>

          {food.status === "available" && (
            <ActionButton className="w-full" size="lg" onClick={handleClaim} disabled={claiming}>
              {claiming ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              {claiming ? "Claiming..." : "Claim Food"}
            </ActionButton>
          )}
          {food.status === "claimed" && (
            <div className="p-4 rounded-xl bg-primary/10 text-center text-primary font-medium text-sm">
              This food has been claimed
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
