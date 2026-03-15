import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_FOOD_DATA } from "@/lib/mock-data";
import { LayoutDashboard, Plus, Package, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

const MyDonationsPage = () => (
  <DashboardLayout items={sidebarItems} role="provider">
    <TopBar title="My Donations" subtitle="Track all your food donations." />

    <div className="matte-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Food", "Quantity", "Servings", "Status", "NGO", "Pickup Time"].map(h => (
                <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_FOOD_DATA.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.quantity}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.servings}</td>
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

export default MyDonationsPage;
