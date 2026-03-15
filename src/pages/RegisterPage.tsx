import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ActionButton } from "@/components/ActionButton";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";

const RegisterPage = () => {
  const [tab, setTab] = useState<"provider" | "ngo">("provider");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 gradient-green items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative text-center max-w-md">
          <Leaf size={64} className="text-primary-foreground/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-foreground">Join the movement</h2>
          <p className="text-primary-foreground/70 mt-4 text-lg">Help reduce food waste in your community.</p>
        </motion.div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-8">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start making an impact today</p>

          <div className="flex bg-muted rounded-xl p-1 mt-6">
            {(["provider", "ngo"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t === "provider" ? "Food Provider" : "NGO"}
              </button>
            ))}
          </div>

          <form className="space-y-4 mt-6" onSubmit={e => e.preventDefault()}>
            {tab === "provider" ? (
              <>
                <InputField label="Full Name" placeholder="John Doe" />
                <InputField label="Organization" placeholder="Restaurant name" />
                <InputField label="Phone" placeholder="+91 98765 43210" type="tel" />
                <InputField label="Email" placeholder="you@example.com" type="email" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <InputField label="Location" placeholder="City, State" />
              </>
            ) : (
              <>
                <InputField label="NGO Name" placeholder="FoodForAll Foundation" />
                <InputField label="Registration ID" placeholder="NGO-2024-XXXX" />
                <InputField label="Phone" placeholder="+91 98765 43210" type="tel" />
                <InputField label="Email" placeholder="ngo@example.com" type="email" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <InputField label="Service Area" placeholder="District or city area" />
              </>
            )}

            <div className="p-4 bg-accent rounded-xl flex gap-3">
              <AlertCircle size={18} className="text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground">
                By registering, you agree to our terms of service and food safety guidelines.
              </p>
            </div>

            <Link to={tab === "provider" ? "/provider/dashboard" : "/ngo/dashboard"}>
              <ActionButton className="w-full" size="lg">Create Account</ActionButton>
            </Link>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
    />
  </div>
);

export default RegisterPage;
