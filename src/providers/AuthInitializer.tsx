import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await userService.getUserProfile();
        setUser(user);
      } catch {
        logout();
      }
    };

    init();
  }, [setUser, logout]);

  return <>{children}</>;
}