import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Provider Routes */}
            <Route path="/provider/dashboard" element={<AuthGuard requireRole="provider"><ProviderDashboard /></AuthGuard>} />
            <Route path="/provider/add-food" element={<AuthGuard requireRole="provider"><AddFoodPage /></AuthGuard>} />
            <Route path="/provider/donations" element={<AuthGuard requireRole="provider"><MyDonationsPage /></AuthGuard>} />
            
            {/* Protected NGO Routes */}
            <Route path="/ngo/dashboard" element={<AuthGuard requireRole="ngo"><NGODashboard /></AuthGuard>} />
            <Route path="/ngo/available" element={<AuthGuard requireRole="ngo"><AvailableFoodPage /></AuthGuard>} />
            <Route path="/ngo/claimed" element={<AuthGuard requireRole="ngo"><ClaimedFoodPage /></AuthGuard>} />
            <Route path="/ngo/food/:id" element={<AuthGuard requireRole="ngo"><FoodDetailPage /></AuthGuard>} />
            
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
