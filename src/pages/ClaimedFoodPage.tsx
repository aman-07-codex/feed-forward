import { DashboardLayout } from "@/layouts/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { FoodCard } from "@/components/FoodCard";
import { MOCK_FOOD_DATA } from "@/lib/mock-data";
import { LayoutDashboard, Search, Package, History, User } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
  { label: "Available", href: "/ngo/available", icon: Search },
  { label: "Claimed", href: "/ngo/claimed", icon: Package },
  { label: "History", href: "/ngo/dashboard", icon: History },
  { label: "Profile", href: "/ngo/dashboard", icon: User },
];

const ClaimedFoodPage = () => {
  const claimed = MOCK_FOOD_DATA.filter(f => f.status === "claimed");

  return (
    <DashboardLayout items={sidebarItems} role="ngo">
      <TopBar title="Claimed Food" subtitle="Food you've claimed for pickup." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {claimed.map(item => (
          <FoodCard key={item.id} data={item} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ClaimedFoodPage;
