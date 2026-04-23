import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold tracking-tight">404</div>
        <h1 className="mt-3 text-2xl font-semibold">Video unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page was removed, made private, or never existed in the first place.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
