import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useUIStore } from "@/store/uiStore";
import { useEffect, useState } from "react";

export default function Layout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        {!isMobile && sidebarOpen && (
          <aside className="w-60 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground sticky top-14 h-[calc(100vh-3.5rem)]">
            <Sidebar />
          </aside>
        )}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-72">
              <div className="h-full bg-sidebar text-sidebar-foreground">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
        )}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
