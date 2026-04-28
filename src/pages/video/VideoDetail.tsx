import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp, ThumbsDown, Share2, Bookmark, CheckCircle2,
} from "lucide-react";
import VideoPlayer from "@/features/video/VideoPlayer";
import RelatedVideos from "@/features/video/RelatedVideos";
import CommentList from "@/features/video/CommentList";
import { videoService } from "@/services/videoService";
import { formatViews, timeAgo } from "@/utils/format";
import type { Video } from "@/types/media/video";

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [related, setRelated] = useState<Video[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const v = await videoService.getVideoById(id);
      const rel = await videoService.getRelated(id);
      if (!cancelled) {
        setVideo(v ?? null);
        setRelated(rel);
        setLiked(null);
        setSubscribed(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!video) {
    return (
      <div className="p-6 text-muted-foreground">Loading video...</div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 min-w-0">
          <VideoPlayer
            src={video.hlsUrl}
            poster={video.thumbnail}
          />
          <h1 className="text-xl sm:text-2xl font-bold mt-4 leading-snug">{video.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={video.channel.avatar} />
                <AvatarFallback>{video.channel.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <span className="truncate">{video.channel.name}</span>
                  {video.channel.verified && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatViews(video.channel.subscribers)} subscribers
                </div>
              </div>
              <Button
                onClick={() => setSubscribed((s) => !s)}
                variant={subscribed ? "secondary" : "default"}
                className="ml-2 rounded-full"
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full bg-secondary overflow-hidden">
                <Button
                  variant="ghost"
                  className="rounded-none rounded-l-full px-4"
                  onClick={() => setLiked(liked === "up" ? null : "up")}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${liked === "up" ? "fill-current" : ""}`} />
                  {formatViews(video.likes + (liked === "up" ? 1 : 0))}
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  className="rounded-none rounded-r-full px-4"
                  onClick={() => setLiked(liked === "down" ? null : "down")}
                >
                  <ThumbsDown className={`h-4 w-4 ${liked === "down" ? "fill-current" : ""}`} />
                </Button>
              </div>
              <Button variant="secondary" className="rounded-full">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="secondary" className="rounded-full">
                <Bookmark className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>

          <Card className="mt-4 rounded-xl">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <Badge variant="secondary" className="rounded-md">{video.category}</Badge>
                <span>{formatViews(video.views)} views</span>
                <span className="text-muted-foreground">{timeAgo(video.publishedAt)}</span>
              </div>
              <p className="text-sm mt-3 whitespace-pre-line text-foreground/90">
                {video.description}
              </p>
            </CardContent>
          </Card>

          <CommentList comments={video.comments} />
        </div>

        <aside className="lg:col-span-4 min-w-0">
          <h3 className="text-sm font-semibold mb-3">Up next</h3>
          <RelatedVideos videos={related} />
          <p className="text-xs text-muted-foreground mt-4">
            Looking for more? <Link to="/" className="underline">Browse all</Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
