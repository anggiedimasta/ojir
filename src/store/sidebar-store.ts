import { useEffect, useState } from "react";
import { create } from "zustand";

interface SidebarStore {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

// Get initial state from localStorage
const getInitialState = (): boolean => {
  // Always start with expanded sidebar to avoid hydration mismatch
  // The client will update this after hydration
  return false;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: getInitialState(),
  setCollapsed: (collapsed: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
    set({ isCollapsed: collapsed });
  },
}));

// Custom hook to handle hydration properly
export const useSidebarStoreHydrated = () => {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Sync with localStorage after hydration
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true" && !isCollapsed) {
      setCollapsed(true);
    }
    setHasHydrated(true);
  }, [isCollapsed, setCollapsed]);

  return { isCollapsed, setCollapsed, hasHydrated };
};
