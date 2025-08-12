"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLoadingStore } from "~/store";
import { LoadingTimeout } from "~/enums";

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startNavigation, stopNavigation } = useLoadingStore();
  const previousPathname = useRef<string>("");
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show loading if the pathname actually changed
    if (previousPathname.current && previousPathname.current !== pathname) {
      startNavigation();

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set a minimum loading time to ensure smooth UX
      loadingTimeoutRef.current = setTimeout(() => {
        stopNavigation();
      }, LoadingTimeout.ROUTE_CHANGE);
    }

    // Update the previous pathname
    previousPathname.current = pathname;

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [pathname, startNavigation, stopNavigation]);

  // Handle search params changes (for query-based navigation)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (previousPathname.current === pathname) {
      // Same path but different search params - show brief loading
      startNavigation();

      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      loadingTimeoutRef.current = setTimeout(() => {
        stopNavigation();
      }, LoadingTimeout.SEARCH_PARAMS);
    }
  }, [pathname, startNavigation, stopNavigation, searchParams]);

  // Listen for page load completion
  useEffect(() => {
    const handleLoad = () => {
      stopNavigation();
    };

    // If the page is already loaded, clear loading immediately
    if (document.readyState === "complete") {
      stopNavigation();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [stopNavigation]);

  return null; // This component doesn't render anything
}
