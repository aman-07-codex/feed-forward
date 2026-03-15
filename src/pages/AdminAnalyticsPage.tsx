import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { DashboardCard } from "@/components/DashboardCard";
import { MOCK_CHART_DATA, MOCK_PROVIDER_GROWTH } from "@/lib/mock-data";
import { LayoutDashboard, Plus, Package, BarChart3, User, TrendingUp, Users, Utensils } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

const AdminAnalyticsPage = () => (
  <DashboardLayout items={sidebarItems} role="admin">
    <TopBar title="Analytics" subtitle="Platform performance at a glance." />

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <DashboardCard label="Total Food Saved" value="12,480 kg" icon={Utensils} trend="+24%" color="green" />
      <DashboardCard label="Total Meals Served" value="45,230" icon={TrendingUp} trend="+18%" color="amber" />
      <DashboardCard label="Active Providers" value="892" icon={Users} trend="+12%" color="blue" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="matte-card rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Food Saved (kg)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={MOCK_CHART_DATA}>
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
          <BarChart data={MOCK_CHART_DATA}>
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
          <LineChart data={MOCK_PROVIDER_GROWTH}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
            <Tooltip />
            <Line type="monotone" dataKey="providers" stroke="hsl(142, 71%, 36%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 36%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default AdminAnalyticsPage;
