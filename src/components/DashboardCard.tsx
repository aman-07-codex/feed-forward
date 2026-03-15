import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "green" | "amber" | "red" | "blue";
}

const colorMap = {
  green: "bg-accent text-accent-foreground",
  amber: "bg-secondary/10 text-secondary",
  red: "bg-destructive/10 text-destructive",
  blue: "bg-primary/10 text-primary",
};

export const DashboardCard = ({ label, value, icon: Icon, trend, color = "green" }: DashboardCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="matte-card-hover rounded-2xl p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
        {trend && (
          <span className="text-xs font-medium text-primary mt-2 inline-block">{trend}</span>
        )}
      </div>
      <div className={cn("p-3 rounded-xl", colorMap[color])}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);
