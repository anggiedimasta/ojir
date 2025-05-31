import { create } from 'zustand'

interface SidebarStore {
  isCollapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

// Get initial state from localStorage
const getInitialState = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  }
  return false
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: getInitialState(),
  setCollapsed: (collapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
    set({ isCollapsed: collapsed })
  },
}))