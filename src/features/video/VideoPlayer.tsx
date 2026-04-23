import { sampleVideoSrc } from "@/services/mockData";

export default function VideoPlayer({ poster }: { poster?: string }) {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        key={sampleVideoSrc}
        controls
        poster={poster}
        className="w-full h-full"
        preload="metadata"
      >
        <source src={sampleVideoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
