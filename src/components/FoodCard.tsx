import { motion } from "framer-motion";
import { Clock, MapPin, Users } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";

interface FoodCardProps {
  data: {
    id: string;
    food_name: string;
    food_type: string;
    serves_count: number;
    pickup_deadline: string;
    pickup_location: string;
    status: string;
    profiles?: {
      organization_name?: string;
    };
  };
  onClaim?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

export const FoodCard = ({ data, onClaim, onView, showActions = false }: FoodCardProps) => {
  const timeLeft = data.pickup_deadline ? formatDistanceToNow(new Date(data.pickup_deadline), { addSuffix: true }) : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="matte-card-hover p-5 rounded-2xl flex flex-col gap-4 group cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <StatusBadge status={data.status} />
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          <Clock size={14} /> {timeLeft}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {data.food_name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-1">{data.profiles?.organization_name || "Unknown Provider"}</p>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground text-sm border-t border-border pt-4">
        <div className="flex items-center gap-1">
          <Users size={16} className="text-secondary" /> {data.serves_count} servings
        </div>
        <div className="flex items-center gap-1 max-w-[50%]">
          <MapPin size={16} className="text-primary min-w-[16px]" /> 
          <span className="truncate">{data.pickup_location}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          <button onClick={onView} className="flex-1 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors">
            View
          </button>
          {data.status === "available" && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onClaim}
              className="flex-1 py-2 text-sm font-medium rounded-lg gradient-green text-primary-foreground shadow-green"
            >
              Claim
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};
