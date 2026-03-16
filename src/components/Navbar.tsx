import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", href: "/", id: "top" },
  { label: "Features", href: "/#features", id: "features" },
  { label: "How it Works", href: "/#how-it-works", id: "how-it-works" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully.");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 150; // offset for navbar

      const featuresEl = document.getElementById("features");
      const howItWorksEl = document.getElementById("how-it-works");

      // Check in reverse order (lowest section first)
      if (howItWorksEl && scrollPosition >= howItWorksEl.offsetTop) {
        setActiveSection("how-it-works");
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveSection("features");
      } else {
        setActiveSection("top");
      }
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(id); // Optimistically update before scroll finishes

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else if (location.pathname !== "/") {
      // If not on home page, navigate to home with hash
      window.location.href = `/#${id}`;
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-card/80 backdrop-blur-xl shadow-sm border-b border-border" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 relative">
            {navLinks.map(link => (
              <motion.button
                key={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                  activeSection === link.id
                    ? "text-primary bg-primary/20 font-semibold" 
                    : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link to="/provider/dashboard">
                  <ActionButton variant="ghost" size="sm">Dashboard</ActionButton>
                </Link>
                <ActionButton variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} className="mr-1" /> Sign Out
                </ActionButton>
              </>
            ) : (
              <>
                <Link to="/login">
                  <ActionButton variant="ghost" size="sm">Login</ActionButton>
                </Link>
                <Link to="/register">
                  <ActionButton size="sm">Donate Food</ActionButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <motion.button
                  key={link.href}
                  onClick={(e) => scrollToSection(e, link.id)}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeSection === link.id
                      ? "bg-primary/20 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                {session ? (
                  <>
                    <Link to="/provider/dashboard" onClick={() => setMobileOpen(false)}>
                      <ActionButton variant="outline" size="sm" className="w-full">Dashboard</ActionButton>
                    </Link>
                    <ActionButton size="sm" className="w-full" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut size={16} className="mr-1" /> Sign Out
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <ActionButton variant="outline" size="sm" className="w-full">Login</ActionButton>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <ActionButton size="sm" className="w-full">Donate Food</ActionButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
