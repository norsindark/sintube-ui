export type VideoCategory =
  | "All"
  | "Music"
  | "Gaming"
  | "Live"
  | "News"
  | "Coding"
  | "Cooking"
  | "Travel"
  | "Sports"
  | "Comedy"
  | "Tech"
  | "Podcasts";

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  verified: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  hlsUrl: string;
  duration: number;
  views: number;
  publishedAt: string;
  description: string;
  channel: Channel;
  likes: number;
  comments: Comment[];
  category: VideoCategory;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  publishedAt: string;
  likes: number;
}

export interface VideoSearchRequest {
  query: string;
}

export interface VideoListRequest {
  category?: VideoCategory;
  page?: number;
  size?: number;
}

export function mapVideo(v: any): Video {
  return {
    id: v?.videoId ?? "",
    title: v?.title ?? "",
    category: v?.category ?? "All",
    duration: v?.duration ?? 0,
    views: v?.views ?? 0,
    publishedAt: v?.createdAt ?? "",
    description: v?.description ?? "",
    hlsUrl: v?.hlsUrl ?? "",
    thumbnail: v?.thumbnailUrl ?? "",
    channel: mapChannel(v?.channel),
    likes: v?.likes ?? 0,
    comments: [],
  };
}

function mapChannel(c: any) {
  return {
    id: c?.id ?? "",
    name: c?.name ?? "Unknown channel",
    avatar: c?.avatar ?? "",
    verified: c?.verified ?? false,
    subscribers: c?.subscribers ?? 0,
  };
}