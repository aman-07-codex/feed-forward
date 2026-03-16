import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ActionButton } from "@/components/ActionButton";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const LoginPage = () => {
  const [role, setRole] = useState<"provider" | "ngo">("provider");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Check role mapping
      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();
          
        if (profile) {
          if (profile.role !== role) {
            toast.warning(`You are signing in as a ${profile.role}, not a ${role}. Redirecting...`);
          }
           navigate(profile.role === "provider" ? "/provider/dashboard" : "/ngo/dashboard");
        } else {
           // Fallback if profile somehow missing
           navigate(role === "provider" ? "/provider/dashboard" : "/ngo/dashboard");
        }
        toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-1 gradient-green items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-md"
        >
          <Leaf size={64} className="text-primary-foreground/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-foreground">Waste is a logistics failure.</h2>
          <p className="text-primary-foreground/70 mt-4 text-lg">We are the solution.</p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-8">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>

          {/* Role toggle */}
          <div className="flex bg-muted rounded-xl p-1 mt-6">
            {(["provider", "ngo"] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                {r === "provider" ? "Food Provider" : "NGO"}
              </button>
            ))}
          </div>

          <form className="space-y-4 mt-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" /> Remember me
              </label>
              <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
            </div>

            <ActionButton className="w-full mt-2" size="lg" type="submit" disabled={loading}>
               {loading ? <Loader2 className="animate-spin mr-2" /> : null}
               {loading ? "Signing In..." : "Sign In"}
            </ActionButton>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
