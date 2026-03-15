import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActionButton } from "@/components/ActionButton";
import { MOCK_STATS } from "@/lib/mock-data";
import {
  Upload, MapPin, Bell, Truck, BarChart3, ArrowRight,
  UserPlus, CloudUpload, HandHeart, Package,
  Utensils, Users, Building, Heart,
} from "lucide-react";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const AnimatedCounter = ({ end, label, icon: Icon }: { end: number; label: string; icon: any }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div variants={fadeUp} className="text-center">
      <div className="inline-flex p-3 rounded-xl bg-accent mb-3">
        <Icon size={24} className="text-accent-foreground" />
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-foreground">{count.toLocaleString()}+</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

const features = [
  { icon: Upload, title: "Upload Food", desc: "Quickly list surplus food with details and photos." },
  { icon: MapPin, title: "Location Matching", desc: "Smart matching connects food to nearest NGOs." },
  { icon: Bell, title: "NGO Notifications", desc: "Instant alerts when food is available nearby." },
  { icon: Truck, title: "Pickup Management", desc: "Coordinate pickups with real-time tracking." },
  { icon: BarChart3, title: "Impact Tracking", desc: "Measure your contribution with detailed analytics." },
];

const steps = [
  { icon: UserPlus, title: "Register", desc: "Sign up as a food provider or NGO partner." },
  { icon: CloudUpload, title: "Upload Food", desc: "List surplus food with quantity and pickup time." },
  { icon: HandHeart, title: "NGO Claims", desc: "Nearby NGOs get notified and claim the food." },
  { icon: Package, title: "Pickup", desc: "Coordinate pickup and confirm delivery." },
];

const floatingCards = [
  { title: "50 servings of Biryani", time: "2h left", color: "bg-accent" },
  { title: "100 Bread Rolls", time: "4h left", color: "bg-secondary/10" },
  { title: "Pasta for 35", time: "1h left", color: "bg-primary/10" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-6">
                <Heart size={12} /> Reducing waste, feeding lives
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
                Reduce Food Waste,{" "}
                <span className="text-primary">Feed Lives</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-6 max-w-lg">
                Connect surplus food with NGOs instantly. Every meal saved is a life nourished.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/register">
                  <ActionButton size="lg">
                    Donate Food <ArrowRight size={18} />
                  </ActionButton>
                </Link>
                <Link to="/ngo/dashboard">
                  <ActionButton variant="outline" size="lg">Find Food</ActionButton>
                </Link>
              </div>
            </motion.div>

            {/* Floating cards */}
            <div className="relative hidden lg:block h-[400px]">
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute matte-card rounded-2xl p-4 w-64"
                  style={{
                    top: `${i * 120 + 20}px`,
                    right: `${i % 2 === 0 ? 0 : 80}px`,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${card.color} mb-2`}>
                    Available
                  </div>
                  <p className="font-semibold text-foreground text-sm">{card.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <AnimatedCounter end={MOCK_STATS.foodSaved} label="Kg Food Saved" icon={Utensils} />
          <AnimatedCounter end={MOCK_STATS.mealsServed} label="Meals Served" icon={Heart} />
          <AnimatedCounter end={MOCK_STATS.activeNGOs} label="Active NGOs" icon={Building} />
          <AnimatedCounter end={MOCK_STATS.providersRegistered} label="Providers" icon={Users} />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground">
              Powerful Features
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-md mx-auto">
              Everything you need to manage food redistribution efficiently.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                className="matte-card-hover rounded-2xl p-6 group"
              >
                <div className="p-3 rounded-xl bg-accent w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon size={22} className="text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3">Four simple steps to make an impact.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} custom={i} className="text-center relative">
                <div className="mx-auto w-16 h-16 rounded-2xl gradient-green flex items-center justify-center shadow-green mb-4">
                  <s.icon size={28} className="text-primary-foreground" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="hidden lg:block absolute -right-3 top-7 text-muted-foreground/30" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="matte-card rounded-3xl p-10 sm:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ready to make a difference?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Join hundreds of providers and NGOs already reducing food waste in their communities.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to="/register">
                  <ActionButton size="lg">Get Started Free</ActionButton>
                </Link>
                <Link to="/login">
                  <ActionButton variant="outline" size="lg">Sign In</ActionButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
