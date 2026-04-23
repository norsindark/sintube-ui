import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { timeAgo, formatViews } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";
import type { Comment } from "@/types";

export default function CommentList({ comments }: { comments: Comment[] }) {
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState(comments);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !user) return;
    setItems([
      {
        id: `local-${Date.now()}`,
        text: draft.trim(),
        publishedAt: new Date().toISOString(),
        likes: 0,
        user: { id: user.id, name: user.name, avatar: user.avatar },
      },
      ...items,
    ]);
    setDraft("");
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-4">{items.length} Comments</h3>
      <form onSubmit={submit} className="flex gap-3 mb-8">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "ME"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="rounded-md"
          />
          <Button type="submit" disabled={!draft.trim()} className="rounded-full">
            Comment
          </Button>
        </div>
      </form>
      <div className="space-y-6">
        {items.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={c.user.avatar} />
              <AvatarFallback>{c.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{c.user.name}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(c.publishedAt)}</span>
              </div>
              <p className="text-sm mt-1 break-words">{c.text}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <span>{formatViews(c.likes)}</span>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full ml-2 h-8">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
