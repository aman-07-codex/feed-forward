import { Leaf, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <div className="relative">
      <Utensils size={24} className="text-primary" />
      <Leaf size={14} className="text-primary absolute -top-1 -right-1" />
    </div>
    <span className="text-lg font-bold text-foreground">
      Nourish<span className="text-primary">Connect</span>
    </span>
  </Link>
);
