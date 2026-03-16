import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { DashboardCard } from "@/components/DashboardCard";
import { LayoutDashboard, Plus, Package, BarChart3, User, TrendingUp, Users, Utensils, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

// Sample chart data for visualization
const CHART_DATA = [
  { month: "Jan", foodSaved: 420, mealsServed: 1200 },
  { month: "Feb", foodSaved: 580, mealsServed: 1650 },
  { month: "Mar", foodSaved: 720, mealsServed: 2100 },
  { month: "Apr", foodSaved: 890, mealsServed: 2480 },
  { month: "May", foodSaved: 1050, mealsServed: 3200 },
  { month: "Jun", foodSaved: 1240, mealsServed: 3800 },
];

const PROVIDER_GROWTH = [
  { month: "Jan", providers: 45 },
  { month: "Feb", providers: 68 },
  { month: "Mar", providers: 102 },
  { month: "Apr", providers: 158 },
  { month: "May", providers: 230 },
  { month: "Jun", providers: 312 },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ totalFood: "0", totalMeals: "0", activeProviders: "0" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total food posts
        const { count: foodCount } = await supabase
          .from("food_posts")
          .select("*", { count: "exact", head: true });

        // Total meals served (sum serves_count for completed)
        const { data: completedPosts } = await supabase
          .from("food_posts")
          .select("serves_count")
          .eq("status", "completed");

        const totalMeals = completedPosts?.reduce((sum, p) => sum + (p.serves_count || 0), 0) || 0;

        // Active providers (unique provider_ids)
        const { data: providers } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "provider");

        setStats({
          totalFood: (foodCount || 0).toLocaleString(),
          totalMeals: totalMeals.toLocaleString(),
          activeProviders: (providers?.length || 0).toString(),
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout items={sidebarItems} role="admin">
      <TopBar title="Analytics" subtitle="Platform performance at a glance." />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <DashboardCard label="Total Food Posts" value={stats.totalFood} icon={Utensils} color="green" />
            <DashboardCard label="Total Meals Served" value={stats.totalMeals} icon={TrendingUp} color="amber" />
            <DashboardCard label="Active Providers" value={stats.activeProviders} icon={Users} color="blue" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="matte-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Food Saved (kg)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 36%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="foodSaved" stroke="hsl(142, 71%, 36%)" fill="url(#greenGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="matte-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Meals Served</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Bar dataKey="mealsServed" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="matte-card rounded-2xl p-6 lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-4">Provider Growth</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={PROVIDER_GROWTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="providers" stroke="hsl(142, 71%, 36%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 36%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
