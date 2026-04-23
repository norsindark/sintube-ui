import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  searchQuery: "",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
