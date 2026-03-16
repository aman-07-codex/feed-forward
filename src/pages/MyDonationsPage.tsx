import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { StatusBadge } from "@/components/StatusBadge";
import { LayoutDashboard, Plus, Package, BarChart3, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ActionButton } from "@/components/ActionButton";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

export default function MyDonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDonations = async () => {
      try {
        const { data, error } = await supabase
          .from("food_posts")
          .select("*, claims(ngo_id, status, profiles(organization_name))")
          .eq("provider_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("food_posts")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout items={sidebarItems} role="provider">
      <TopBar title="My Donations" subtitle="Track all your food donations." />

      <div className="matte-card rounded-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : donations.length === 0 ? (
           <div className="flex flex-col h-64 items-center justify-center text-center px-4">
            <Package className="text-muted-foreground/30 mb-4" size={64} />
            <h3 className="text-xl font-bold text-foreground">No donations yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-6">You haven't posted any surplus food yet. Create your first donation to start making an impact.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Food", "Quantity", "Servings", "Status", "NGO Claim", "Pickup Time", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((item, i) => {
                  const claim = item.claims?.[0];
                  const ngoName = claim?.profiles?.organization_name;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.food_name}</p>
                          <p className="text-xs text-muted-foreground">{item.food_type}</p>
                        </div>
                      </td>
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
                      <td className="px-5 py-4">
                         {item.status === 'available' && (
                           <button onClick={() => updateStatus(item.id, 'completed')} className="text-xs font-medium text-primary hover:underline">
                             Mark Completed
                           </button>
                         )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
