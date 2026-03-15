import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { ActionButton } from "@/components/ActionButton";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_FOOD_DATA } from "@/lib/mock-data";
import { LayoutDashboard, Search, Package, History, User, MapPin, Clock, Users, Phone, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
  { label: "Available", href: "/ngo/available", icon: Search },
  { label: "Claimed", href: "/ngo/claimed", icon: Package },
  { label: "History", href: "/ngo/dashboard", icon: History },
  { label: "Profile", href: "/ngo/dashboard", icon: User },
];

const FoodDetailPage = () => {
  const { id } = useParams();
  const food = MOCK_FOOD_DATA.find(f => f.id === id) || MOCK_FOOD_DATA[0];

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <Link to="/ngo/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 matte-card rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{food.title}</h1>
              <p className="text-muted-foreground mt-1">{food.providerName}</p>
            </div>
            <StatusBadge status={food.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Servings", value: food.servings },
              { icon: Package, label: "Quantity", value: food.quantity },
              { icon: Clock, label: "Time Left", value: food.timeLeft },
              { icon: MapPin, label: "Distance", value: `${food.distance}km` },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-muted/50 text-center">
                <item.icon size={20} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-muted h-48 flex items-center justify-center border border-border">
            <div className="text-center">
              <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Map preview placeholder</p>
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
                  <p className="font-medium text-foreground">{food.providerName}</p>
                  <p className="text-xs text-muted-foreground">Verified provider</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Phone size={16} className="text-accent-foreground" />
                </div>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <ActionButton className="w-full" size="lg">Claim Food</ActionButton>
          <ActionButton variant="outline" className="w-full" size="lg">Navigate</ActionButton>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FoodDetailPage;
