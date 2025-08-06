import { useSidebarStore, useSidebarStoreHydrated } from '~/store/sidebar-store';

// Re-export the sidebar hooks with better naming
export const useSidebar = useSidebarStore;
export const useSidebarHydrated = useSidebarStoreHydrated;

// Optional: Create a combined hook for easier usage
export const useSidebarState = () => {
  const sidebar = useSidebarStore();
  const { hasHydrated } = useSidebarStoreHydrated();
  
  return {
    ...sidebar,
    hasHydrated
  };
};