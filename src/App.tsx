import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProviderDashboard from "./pages/ProviderDashboard";
import AddFoodPage from "./pages/AddFoodPage";
import MyDonationsPage from "./pages/MyDonationsPage";
import NGODashboard from "./pages/NGODashboard";
import AvailableFoodPage from "./pages/AvailableFoodPage";
import ClaimedFoodPage from "./pages/ClaimedFoodPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/add-food" element={<AddFoodPage />} />
          <Route path="/provider/donations" element={<MyDonationsPage />} />
          <Route path="/ngo/dashboard" element={<NGODashboard />} />
          <Route path="/ngo/available" element={<AvailableFoodPage />} />
          <Route path="/ngo/claimed" element={<ClaimedFoodPage />} />
          <Route path="/ngo/food/:id" element={<FoodDetailPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
