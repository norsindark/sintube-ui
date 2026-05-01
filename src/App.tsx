import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import PublicOnly from "@/components/layout/PublicOnly";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/dashboard/Home";
import VideoDetail from "@/pages/video/VideoDetail";
import Profile from "@/pages/user/Profile";
import NotFound from "@/pages/NotFound";

import AuthInitializer from "@/providers/AuthInitializer";

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

  return (
    <TooltipProvider>
      <AuthInitializer>
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
      </AuthInitializer>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;