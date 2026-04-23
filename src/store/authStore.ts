import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setUser: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: "yt-mini-auth" },
  ),
);
