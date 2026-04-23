import { Link } from "react-router-dom";
import { formatDuration, formatViews, timeAgo } from "@/utils/format";
import type { Video } from "@/types";

export default function RelatedVideos({ videos }: { videos: Video[] }) {
  return (
    <div className="space-y-3">
      {videos.map((v) => (
        <Link key={v.id} to={`/video/${v.id}`} className="flex gap-2 group">
          <div className="relative w-40 shrink-0 aspect-video overflow-hidden rounded-lg bg-muted">
            <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium">
              {formatDuration(v.duration)}
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold line-clamp-2 leading-snug">{v.title}</h4>
            <div className="text-xs text-muted-foreground mt-1 truncate">{v.channel.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatViews(v.views)} · {timeAgo(v.publishedAt)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
