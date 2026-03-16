import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { ActionButton } from "@/components/ActionButton";
import { LayoutDashboard, Plus, Package, BarChart3, User, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Food", href: "/provider/add-food", icon: Plus },
  { label: "My Donations", href: "/provider/donations", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/provider/dashboard", icon: User },
];

const AddFoodPage = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    food_name: '',
    food_type: 'Cooked Food',
    quantity: '',
    serves_count: '',
    pickup_deadline_hours: '1 Hour',
    pickup_location: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDeadline = (hoursString: string) => {
    const hours = parseInt(hoursString.split(' ')[0], 10);
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + hours);
    return deadline.toISOString();
  };

  const handlePostFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const deadline = calculateDeadline(formData.pickup_deadline_hours);

      const { error } = await supabase.from('food_posts').insert([
        {
          provider_id: user.id,
          food_name: formData.food_name,
          food_type: formData.food_type,
          quantity: formData.quantity,
          serves_count: parseInt(formData.serves_count, 10),
          pickup_deadline: deadline,
          pickup_location: formData.pickup_location,
          notes: formData.notes,
          status: 'available'
        }
      ]);

      if (error) throw error;
      
      setSuccess(true);
      // Reset form
      setFormData({
        food_name: '',
        food_type: 'Cooked Food',
        quantity: '',
        serves_count: '',
        pickup_deadline_hours: '1 Hour',
        pickup_location: '',
        notes: ''
      });
      
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to post food donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <form className="space-y-5" onSubmit={handlePostFood}>
            <InputField name="food_name" value={formData.food_name} onChange={handleChange} label="Food Item Name" placeholder="e.g., Vegetable Biryani" required />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Food Type</label>
              <select name="food_type" value={formData.food_type} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all">
                <option>Cooked Food</option>
                <option>Raw Ingredients</option>
                <option>Packaged Food</option>
                <option>Bakery Items</option>
                <option>Beverages</option>
                <option>Fruits & Vegetables</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField name="quantity" value={formData.quantity} onChange={handleChange} label="Quantity (kg/units)" placeholder="5" type="text" required />
              <InputField name="serves_count" value={formData.serves_count} onChange={handleChange} label="Serves how many" placeholder="50" type="number" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Pickup Deadline</label>
                <select name="pickup_deadline_hours" value={formData.pickup_deadline_hours} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all">
                  <option>1 Hour</option>
                  <option>2 Hours</option>
                  <option>4 Hours</option>
                  <option>6 Hours</option>
                </select>
              </div>
              <InputField name="pickup_location" value={formData.pickup_location} onChange={handleChange} label="Pickup Location" placeholder="Address" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
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
              <ActionButton type="submit" size="lg" className="flex-1" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? "Posting..." : "Post Donation"}
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InputField = ({ label, placeholder, type = "text", name, value, onChange, required }: { label: string; placeholder: string; type?: string; name?: string; value?: string | number; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
    />
  </div>
);

export default AddFoodPage;
