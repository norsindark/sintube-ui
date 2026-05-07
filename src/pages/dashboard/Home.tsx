import { Button } from "@/components/ui/button";
import VideoGrid from "@/features/video/VideoGrid";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/services/mockData";
import { videoService } from "@/services/videoService";
import { useUIStore } from "@/store/uiStore";
import { Video } from "@/types/media/video";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [active, setActive] = useState("All");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const searchQuery = useUIStore((s) => s.searchQuery);

  // RESET khi đổi category hoặc search
  useEffect(() => {
    setVideos([]);
    setCursor(undefined);
    setHasMore(true);
  }, [active, searchQuery]);

  // LOAD DATA
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hasMore) return;

      setLoading(true);

      try {
        const res = searchQuery
          ? await videoService.search(searchQuery)
          : await videoService.getFeed(cursor);

        if (cancelled) return;

        setVideos((prev) => [...prev, ...res.data]);

        if (searchQuery) {
          setHasMore(false); // search chỉ load 1 lần
        } else {
          setCursor(res.nextCursor);
          setHasMore(!!res.nextCursor);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [cursor, searchQuery]);

  // INTERSECTION OBSERVER
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // trigger load next bằng cách set cursor mới
          setCursor((prev) => prev ?? "__init__");
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const heading = useMemo(() => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    return active;
  }, [searchQuery, active]);

  return (
    <div className="px-4 sm:px-6 py-4">
      {/* CATEGORY UI */}
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

      {videos.length === 0 && loading ? (
        <VideoGridSkeleton />
      ) : (
        <>
          <VideoGrid videos={videos} />

          {/* loader trigger */}
          <div ref={loaderRef} className="h-12 flex items-center justify-center">
            {loading && (
              <span className="text-sm text-muted-foreground">Loading...</span>
            )}
            {!hasMore && (
              <span className="text-xs text-muted-foreground">No more videos</span>
            )}
          </div>
        </>
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