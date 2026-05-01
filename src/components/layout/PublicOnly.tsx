import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) return null;

  if (isLoggedIn) return <Navigate to="/" replace />;

  return <>{children}</>;
}