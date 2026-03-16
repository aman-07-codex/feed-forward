import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ActionButton } from "@/components/ActionButton";
import { Eye, EyeOff, Leaf, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const RegisterPage = () => {
  const [tab, setTab] = useState<"provider" | "ngo">("provider");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // full name or NGO name
    organization_name: '', // provider specific or NGO ID
    phone: '',
    address: '', // location or service area
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign Up User — profile is auto-created via database trigger
      // using the metadata we pass here
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: tab,
            organization_name: tab === 'provider' ? formData.organization_name : formData.name,
            phone: formData.phone,
            address: formData.address,
          }
        }
      });

      if (authError) throw authError;

      toast.success("Registration successful! Check your email for a confirmation link, then sign in.");
      navigate('/login');

    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

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

          <form className="space-y-4 mt-6" onSubmit={handleRegister}>
            {tab === "provider" ? (
              <>
                <InputField name="name" value={formData.name} onChange={handleChange} label="Full Name" placeholder="John Doe" required />
                <InputField name="organization_name" value={formData.organization_name} onChange={handleChange} label="Organization" placeholder="Restaurant name" required />
                <InputField name="phone" value={formData.phone} onChange={handleChange} label="Phone" placeholder="+91 98765 43210" type="tel" required />
                <InputField name="email" value={formData.email} onChange={handleChange} label="Email" placeholder="you@example.com" type="email" required />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input name="password" value={formData.password} onChange={handleChange} type={showPw ? "text" : "password"} placeholder="••••••••" required className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <InputField name="address" value={formData.address} onChange={handleChange} label="Location" placeholder="City, State" required />
              </>
            ) : (
              <>
                <InputField name="name" value={formData.name} onChange={handleChange} label="NGO Name" placeholder="FoodForAll Foundation" required />
                <InputField name="organization_name" value={formData.organization_name} onChange={handleChange} label="Registration ID" placeholder="NGO-2024-XXXX" required />
                <InputField name="phone" value={formData.phone} onChange={handleChange} label="Phone" placeholder="+91 98765 43210" type="tel" required />
                <InputField name="email" value={formData.email} onChange={handleChange} label="Email" placeholder="ngo@example.com" type="email" required />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input name="password" value={formData.password} onChange={handleChange} type={showPw ? "text" : "password"} placeholder="••••••••" required className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <InputField name="address" value={formData.address} onChange={handleChange} label="Service Area" placeholder="District or city area" required />
              </>
            )}

            <div className="p-4 bg-accent rounded-xl flex gap-3">
              <AlertCircle size={18} className="text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground">
                By registering, you agree to our terms of service and food safety guidelines.
              </p>
            </div>

            <ActionButton className="w-full" size="lg" disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Create Account"}
            </ActionButton>
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

const InputField = ({ label, placeholder, type = "text", name, value, onChange, required }: { label: string; placeholder: string; type?: string; name?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) => (
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

export default RegisterPage;
