import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import VideoGrid from "@/features/video/VideoGrid";
import { videoService } from "@/services/videoService";
import { CATEGORIES } from "@/services/mockData";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import type { VideoMock } from "@/types";

export default function Home() {
  const [active, setActive] = useState("All");
  const [videos, setVideos] = useState<VideoMock[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = useUIStore((s) => s.searchQuery);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const load = async () => {
      const data = searchQuery
        ? await videoService.search(searchQuery)
        : await videoService.getVideos(active);
      if (!cancelled) {
        setVideos(data);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [active, searchQuery]);

  const heading = useMemo(() => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    return active;
  }, [searchQuery, active]);

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-background/95 backdrop-blur border-b border-border mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={active === c ? "default" : "secondary"}
              onClick={() => setActive(c)}
              className={cn("rounded-lg whitespace-nowrap", active === c && "shadow-sm")}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-4">{heading}</h2>
      {loading ? (
        <VideoGridSkeleton />
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}

function VideoGridSkeleton() {
  return (
    <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-video rounded-xl bg-muted animate-pulse" />
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded bg-muted animate-pulse w-5/6" />
              <div className="h-3 rounded bg-muted animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
