import { Inbox } from "lucide-react";

export const EmptyState = ({ title = "Nothing here yet", description = "Check back later for updates." }: { title?: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="p-4 rounded-full bg-accent mb-4">
      <Inbox size={32} className="text-accent-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
  </div>
);
