export const SkeletonCard = () => (
  <div className="matte-card rounded-2xl p-5 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-6 w-20 bg-muted rounded-md" />
      <div className="h-4 w-16 bg-muted rounded-md" />
    </div>
    <div className="h-5 w-3/4 bg-muted rounded-md mb-2" />
    <div className="h-4 w-1/2 bg-muted rounded-md mb-4" />
    <div className="border-t border-border pt-4 flex gap-4">
      <div className="h-4 w-20 bg-muted rounded-md" />
      <div className="h-4 w-16 bg-muted rounded-md" />
    </div>
  </div>
);
