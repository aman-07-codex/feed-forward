import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, variant = "primary", size = "md", className, ...props }, ref) => {
    const variants = {
      primary: "gradient-green text-primary-foreground shadow-green",
      secondary: "gradient-amber text-secondary-foreground",
      outline: "bg-card text-foreground border border-border hover:bg-accent",
      ghost: "bg-transparent text-foreground hover:bg-accent",
      destructive: "gradient-emergency text-destructive-foreground",
    };
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "rounded-xl font-semibold transition-colors duration-200 cursor-pointer inline-flex items-center justify-center gap-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

ActionButton.displayName = "ActionButton";
export { ActionButton };
