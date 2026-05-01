import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types/user/user";
import type { IdentifyResponse } from "@/types/auth/auth";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  identifyData: IdentifyResponse | null;

  hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setIdentifyData: (data: IdentifyResponse | null) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      identifyData: null,

      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setIdentifyData: (data) => set({ identifyData: data }),

      setUser: (user) =>
        set({
          user,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          identifyData: null,
        }),
    }),
    {
      name: "yt-mini-auth",

      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);