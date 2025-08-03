'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-2xl -z-10" />
          </div>
          <h2 className="text-3xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}