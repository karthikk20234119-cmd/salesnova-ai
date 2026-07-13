import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="w-8 h-8 text-primary animate-spin relative z-10" />
      </div>
      <div className="space-y-2 text-center animate-pulse">
        <h3 className="text-lg font-medium text-foreground">Loading dashboard...</h3>
        <p className="text-sm text-muted-foreground">Getting your data ready</p>
      </div>
    </div>
  );
}
