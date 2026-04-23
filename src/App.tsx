import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import VideoDetail from "@/pages/VideoDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/authStore";

function PublicOnly({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return (
    <TooltipProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
