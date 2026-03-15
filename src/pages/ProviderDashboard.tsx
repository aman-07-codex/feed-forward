import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardCard } from "@/components/DashboardCard";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_FOOD_DATA, MOCK_PROVIDER_STATS } from "@/lib/mock-data";
import { LayoutDashboard, Plus, Package, BarChart3, User, Gift, Utensils, Clock } from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

const ProviderDashboard = () => (
  <DashboardLayout items={sidebarItems} role="provider">
    <TopBar title="Dashboard" subtitle="Manage your food donations and track impact." />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <DashboardCard label="Total Donations" value={MOCK_PROVIDER_STATS.totalDonations} icon={Gift} trend="+8 this month" color="green" />
      <DashboardCard label="Meals Served" value={MOCK_PROVIDER_STATS.mealsServed.toLocaleString()} icon={Utensils} trend="+12%" color="amber" />
      <DashboardCard label="Active Requests" value={MOCK_PROVIDER_STATS.activeRequests} icon={Clock} color="blue" />
    </div>

    <div className="matte-card rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="font-semibold text-foreground">Recent Donations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Food", "Quantity", "Status", "NGO", "Pickup Time"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_FOOD_DATA.slice(0, 5).map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-foreground">{item.title}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.quantity}</td>
                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.ngo || "—"}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.pickupTime}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderDashboard;
