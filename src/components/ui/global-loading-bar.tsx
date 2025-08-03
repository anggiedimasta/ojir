"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "~/store";
import { cn } from "~/lib/utils";

export function GlobalLoadingBar() {
  const { isLoading, loadingMessage } = useLoadingStore();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);

      // Simulate progress animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Stop at 90% until loading completes
          }
          return prev + Math.random() * 15; // Random increments for realistic feel
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Complete the progress bar when loading finishes
      setProgress(100);

      // Hide after animation completes
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Update fixed elements positioning when loading bar is visible
  useEffect(() => {
    const loadingBarHeight = loadingMessage ? 48 : 4; // 4px for progress line, 44px for message

    if (isVisible) {
      // Update body padding
      document.body.style.paddingTop = `${loadingBarHeight}px`;
      document.body.style.transition = 'padding-top 300ms ease-out';

      // Update fixed navbar
      const navbar = document.querySelector('.fixed.top-0.right-0.left-0.z-50') as HTMLElement;
      if (navbar) {
        navbar.style.top = `${loadingBarHeight}px`;
        navbar.style.transition = 'top 300ms ease-out';
      }

      // Update fixed sidebar
      const sidebar = document.querySelector('.fixed.top-0.left-0.h-screen') as HTMLElement;
      if (sidebar) {
        sidebar.style.top = `${loadingBarHeight}px`;
        sidebar.style.transition = 'top 300ms ease-out';
      }

      // Update sidebar toggle button
      const toggleButton = document.querySelector('.fixed.top-6.z-\\[102\\]') as HTMLElement;
      if (toggleButton) {
        toggleButton.style.top = `${24 + loadingBarHeight}px`;
        toggleButton.style.transition = 'top 300ms ease-out';
      }
    } else {
      // Reset body padding
      document.body.style.paddingTop = '0px';

      // Reset fixed navbar
      const navbar = document.querySelector('.fixed.top-0.right-0.left-0.z-50') as HTMLElement;
      if (navbar) {
        navbar.style.top = '0px';
        navbar.style.transition = '';
      }

      // Reset fixed sidebar
      const sidebar = document.querySelector('.fixed.top-0.left-0.h-screen') as HTMLElement;
      if (sidebar) {
        sidebar.style.top = '0px';
        sidebar.style.transition = '';
      }

      // Reset sidebar toggle button
      const toggleButton = document.querySelector('.fixed.top-6.z-\\[102\\]') as HTMLElement;
      if (toggleButton) {
        toggleButton.style.top = '24px';
        toggleButton.style.transition = '';
      }
    }

    return () => {
      // Cleanup
      document.body.style.paddingTop = '0px';
      document.body.style.transition = '';

      const navbar = document.querySelector('.fixed.top-0.right-0.left-0.z-50') as HTMLElement;
      if (navbar) {
        navbar.style.top = '0px';
        navbar.style.transition = '';
      }

      const sidebar = document.querySelector('.fixed.top-0.left-0.h-screen') as HTMLElement;
      if (sidebar) {
        sidebar.style.top = '0px';
        sidebar.style.transition = '';
      }

      const toggleButton = document.querySelector('.fixed.top-6.z-\\[102\\]') as HTMLElement;
      if (toggleButton) {
        toggleButton.style.top = '24px';
        toggleButton.style.transition = '';
      }
    };
  }, [isVisible, loadingMessage]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] transform transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Progress line */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading message */}
      {loadingMessage && (
        <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-3">
              {/* Loading spinner */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-slate-200">
                  {loadingMessage}
                </span>
              </div>

              {/* Progress percentage */}
              <div className="ml-auto">
                <span className="text-xs text-slate-400 font-mono">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}