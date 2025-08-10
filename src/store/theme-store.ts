import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  borderRadius: "none" | "small" | "medium" | "large";
  setBorderRadius: (radius: "none" | "small" | "medium" | "large") => void;
  spacing: "compact" | "comfortable" | "spacious";
  setSpacing: (spacing: "compact" | "comfortable" | "spacious") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
      primaryColor: "#3b82f6", // blue-500
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      borderRadius: "medium",
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      spacing: "comfortable",
      setSpacing: (spacing) => set({ spacing }),
    }),
    {
      name: "theme-storage",
    },
  ),
);
