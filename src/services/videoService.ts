import { apiClient, delay } from "./apiClient";
import { videos } from "./mockData";
import type { Video } from "@/types";

void apiClient;

export const videoService = {
  async getVideos(category?: string): Promise<Video[]> {
    await delay(120);
    if (!category || category === "All") return videos;
    return videos.filter((v) => v.category === category);
  },
  async getVideoById(id: string): Promise<Video | undefined> {
    await delay(120);
    return videos.find((v) => v.id === id);
  },
  async getRelated(id: string): Promise<Video[]> {
    await delay(120);
    const v = videos.find((x) => x.id === id);
    if (!v) return videos.slice(0, 8);
    return videos.filter((x) => x.id !== id && x.category === v.category).concat(
      videos.filter((x) => x.id !== id && x.category !== v.category),
    ).slice(0, 12);
  },
  async search(query: string): Promise<Video[]> {
    await delay(120);
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) => v.title.toLowerCase().includes(q) || v.channel.name.toLowerCase().includes(q),
    );
  },
};
