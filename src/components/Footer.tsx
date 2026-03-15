import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Github, Twitter, Mail } from "lucide-react";

const links = {
  Platform: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "For NGOs", href: "/register" },
    { label: "For Providers", href: "/register" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            Connecting surplus food with communities in need. Reducing waste, feeding lives, one meal at a time.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Github, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading}>
            <h4 className="font-semibold text-sm text-foreground mb-4">{heading}</h4>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-10 pt-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 NourishConnect. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
