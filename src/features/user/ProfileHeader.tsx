import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatViews } from "@/utils/format";
import type { User } from "@/types/user/user";

export default function ProfileHeader({
  user,
  onUploadClick,
}: {
  user: User;
  onUploadClick: () => void;
}) {
  const joined = new Date(user.joinedAt);
  return (
    <div>
      <div className="h-32 sm:h-48 w-full rounded-xl bg-gradient-to-br from-primary/40 via-primary/20 to-accent" />
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16 px-4 sm:px-8">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-background rounded-full">
          <AvatarImage src={user.avatar} alt={user.displayName} />
          <AvatarFallback className="text-2xl">
            {user.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{user.displayName}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            {user.handle} · {formatViews(user.subscribers)} subscribers · Joined{" "}
            {joined.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="rounded-full">Customize channel</Button>
          <Button className="rounded-full">Manage videos</Button>
          <Button className="rounded-full" onClick={onUploadClick}> Upload video</Button>
        </div>
      </div>
    </div>
  );
}