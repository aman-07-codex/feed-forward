import { cn } from "@/lib/utils";

type StatusType = "available" | "claimed" | "completed" | "expired";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-accent text-accent-foreground" },
  claimed: { label: "Claimed", className: "bg-secondary/15 text-secondary" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
  expired: { label: "Expired", className: "bg-destructive/10 text-destructive" },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as StatusType] || statusConfig.available;
  return (
    <span className={cn("px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider", config.className)}>
      {config.label}
    </span>
  );
};
