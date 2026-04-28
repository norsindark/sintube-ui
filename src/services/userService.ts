import { apiClient } from "./api/apiClient";
import { apiRoutes } from "./api/apiRoute";
import { delay } from "./api/apiClient";
import { videos, channels } from "./mockData";
import type { VideoMock, Channel } from "@/types";
import { mapVideo } from "@/types/media/video";

void apiClient;

export const userService = {
  async getUserVideos(_userId: string): Promise<VideoMock[]> {
    await delay(120);
    return videos.slice(0, 8);
  },

  async getMyVideos(): Promise<any[]> {
    const res = await apiClient.get(apiRoutes.video.myVideos);
    return (res.data.content ?? []).map(mapVideo);
  },

  async getSubscriptions(): Promise<Channel[]> {
    await delay(120);
    return channels;
  },
};