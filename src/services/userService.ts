import { delay } from "./apiClient";
import { videos, channels } from "./mockData";
import type { Video, Channel } from "@/types";

export const userService = {
  async getUserVideos(_userId: string): Promise<Video[]> {
    await delay(120);
    return videos.slice(0, 8);
  },
  async getSubscriptions(): Promise<Channel[]> {
    await delay(120);
    return channels;
  },
};
