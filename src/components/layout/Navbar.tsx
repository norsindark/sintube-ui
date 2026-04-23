import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Video, Bell, LogOut, User as UserIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const navigate = useNavigate();
  const [local, setLocal] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(local);
    navigate("/");
  }

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 h-14 bg-background border-b border-border flex items-center px-2 sm:px-4 gap-2 sm:gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center gap-1.5 px-1">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Play className="h-4 w-4 fill-current" />
          </span>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">Sin D</span>
        </Link>
      </div>

      <form onSubmit={onSubmit} className="flex-1 max-w-2xl mx-auto flex items-center">
        <div className="flex w-full">
          <Input
            type="search"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Search"
            className="rounded-l-full rounded-r-none border-r-0 focus-visible:ring-1"
          />
          <Button
            type="submit"
            variant="secondary"
            className="rounded-r-full rounded-l-none border border-l-0 px-5"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex" aria-label="Create">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "ME"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-md">
            <DropdownMenuLabel>
              <div className="font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon className="mr-2 h-4 w-4" /> Your profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
