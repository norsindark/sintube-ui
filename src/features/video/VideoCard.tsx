import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { formatDuration, formatViews, timeAgo } from "@/utils/format";
import type { Video } from "@/types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link to={`/video/${video.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-xs font-medium">
          {formatDuration(video.duration)}
        </span>
      </div>
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
          <AvatarFallback>{video.channel.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{video.title}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">{video.channel.name}</span>
            {video.channel.verified && <CheckCircle2 className="h-3 w-3 shrink-0" />}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
