import VideoCard from "./VideoCard";
import type { Video } from "@/types/media/video";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        No videos found.
      </div>
    );
  }

  return (
    <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}