import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="not-found-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={30}
          className="w-full h-full opacity-30"
          particleColor="#8b5cf6"
        />
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center relative z-10 max-w-md p-6">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary/80 border border-border flex items-center justify-center relative shadow-lg">
            <FileQuestion className="w-12 h-12 text-muted-foreground" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-destructive rounded-full flex items-center justify-center shadow-lg font-bold text-destructive-foreground">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" className="w-full sm:w-auto gap-2" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
          <Button variant="gradient" className="w-full sm:w-auto gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
