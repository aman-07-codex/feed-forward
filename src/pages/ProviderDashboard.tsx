import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { LayoutDashboard, Plus, Package, BarChart3, User, Gift, Utensils, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalDonations: 0, mealsServed: 0, activeRequests: 0 });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch all food posts for this provider
        const { data: posts, error } = await supabase
          .from("food_posts")
          .select("*, claims(ngo_id, status, profiles(organization_name))")
          .eq("provider_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (posts) {
          // Calculate stats
          const totalDonations = posts.length;
          const mealsServed = posts
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + (p.serves_count || 0), 0);
          const activeRequests = posts.filter(p => p.status === 'available').length;

          setStats({ totalDonations, mealsServed, activeRequests });
          setRecentDonations(posts.slice(0, 5)); // First 5 for recent
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <DashboardLayout items={sidebarItems} role="provider">
      <TopBar title="Dashboard" subtitle="Manage your food donations and track impact." />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <DashboardCard label="Total Donations" value={stats.totalDonations} icon={Gift} color="green" />
            <DashboardCard label="Meals Served" value={stats.mealsServed.toLocaleString()} icon={Utensils} color="amber" />
            <DashboardCard label="Active Requests" value={stats.activeRequests} icon={Clock} color="blue" />
          </div>

          <div className="matte-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="font-semibold text-foreground">Recent Donations</h2>
              <Link to="/provider/donations" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            
            {recentDonations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No donations yet.</p>
                <Link to="/provider/add-food" className="text-primary font-medium hover:underline mt-2 inline-block">Post your first donation</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Food", "Quantity", "Servings", "Status", "NGO Claim", "Pickup Time"].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentDonations.map((item, i) => {
                      const claim = item.claims?.[0];
                      const ngoName = claim?.profiles?.organization_name;

                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-foreground">{item.food_name}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{item.quantity}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{item.serves_count}</td>
                          <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {ngoName ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{ngoName}</span>
                                <span className="text-xs">{claim.status}</span>
                              </div>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                            {format(new Date(item.pickup_deadline), 'MMM d, h:mm a')}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
