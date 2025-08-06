import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white">
      <Card className="p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Server Error</h2>
          <p className="text-slate-600 mb-8">
            Something went wrong on our end. Please try again later.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Try Again
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}