import { NavLink } from "react-router-dom";
import {
  Home, Flame, ListVideo, Library, History, Clapperboard,
  Clock, ThumbsUp, Music2, Gamepad2, Newspaper, Tv, Code2, ChefHat,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { channels } from "@/services/mockData";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { to: "/", label: "Home", icon: Home },
  { to: "/", label: "Trending", icon: Flame },
  { to: "/", label: "Subscriptions", icon: ListVideo },
];
const SECONDARY = [
  { to: "/", label: "Library", icon: Library },
  { to: "/", label: "History", icon: History },
  { to: "/", label: "Your Videos", icon: Clapperboard },
  { to: "/", label: "Watch Later", icon: Clock },
  { to: "/", label: "Liked Videos", icon: ThumbsUp },
];
const EXPLORE = [
  { to: "/", label: "Music", icon: Music2 },
  { to: "/", label: "Gaming", icon: Gamepad2 },
  { to: "/", label: "News", icon: Newspaper },
  { to: "/", label: "Live", icon: Tv },
  { to: "/", label: "Coding", icon: Code2 },
  { to: "/", label: "Cooking", icon: ChefHat },
];

function Item({ to, label, icon: Icon, active }: { to: string; label: string; icon: typeof Home; active?: boolean }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 px-3 py-2 rounded-lg text-sm hover-elevate active-elevate-2",
          (isActive && active !== false) ? "bg-accent font-semibold" : "",
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <ScrollArea className="h-full">
      <nav className="px-2 py-3 space-y-0.5">
        {PRIMARY.map((i) => <Item key={i.label} {...i} />)}
        <Separator className="my-3" />
        <div className="px-3 pb-2 text-sm font-semibold">You</div>
        {SECONDARY.map((i) => <Item key={i.label} {...i} />)}
        <Separator className="my-3" />
        <div className="px-3 pb-2 text-sm font-semibold">Subscriptions</div>
        {channels.slice(0, 6).map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover-elevate active-elevate-2 cursor-pointer">
            <Avatar className="h-6 w-6">
              <AvatarImage src={c.avatar} alt={c.name} />
              <AvatarFallback>{c.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{c.name}</span>
          </div>
        ))}
        <Separator className="my-3" />
        <div className="px-3 pb-2 text-sm font-semibold">Explore</div>
        {EXPLORE.map((i) => <Item key={i.label} {...i} />)}
        <div className="px-3 pt-4 pb-6 text-xs text-muted-foreground">
          YouTube Mini · UI demo · {new Date().getFullYear()}
        </div>
      </nav>
    </ScrollArea>
  );
}
