import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { ActionButton } from "@/components/ActionButton";
import { LayoutDashboard, Plus, Package, BarChart3, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

const AddFoodPage = () => {
  const [success, setSuccess] = useState(false);

  return (
    <DashboardLayout items={sidebarItems} role="provider">
      <TopBar title="Donate Surplus Food" subtitle="Fill in details about the food you want to donate." />

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSuccess(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="matte-card rounded-3xl p-10 text-center max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">✓</span>
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Food Posted!</h3>
              <p className="text-sm text-muted-foreground mt-2">NGOs nearby will be notified immediately.</p>
              <ActionButton className="mt-6" onClick={() => setSuccess(false)}>Done</ActionButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl">
        <div className="matte-card rounded-2xl p-6 sm:p-8">
          <form className="space-y-5" onSubmit={e => { e.preventDefault(); setSuccess(true); }}>
            <InputField label="Food Item Name" placeholder="e.g., Vegetable Biryani" />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Food Type</label>
              <select className="w-full p-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all">
                <option>Cooked Food</option>
                <option>Raw Ingredients</option>
                <option>Packaged Food</option>
                <option>Bakery Items</option>
                <option>Beverages</option>
                <option>Fruits & Vegetables</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Quantity (kg)" placeholder="5" type="number" />
              <InputField label="Serves how many" placeholder="50" type="number" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Pickup Deadline</label>
                <select className="w-full p-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all">
                  <option>1 Hour</option>
                  <option>2 Hours</option>
                  <option>4 Hours</option>
                  <option>6 Hours</option>
                </select>
              </div>
              <InputField label="Location" placeholder="Address" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                rows={3}
                placeholder="Any additional details about the food..."
                className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="p-4 bg-secondary/10 rounded-xl flex gap-3">
              <AlertCircle size={18} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-secondary">
                Ensure food is packed in food-grade containers and maintained at safe temperatures.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <ActionButton type="submit" size="lg" className="flex-1">Post Donation</ActionButton>
              <ActionButton variant="outline" size="lg">Save Draft</ActionButton>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InputField = ({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all" />
  </div>
);

export default AddFoodPage;
