export * from "./api/pageResponse";

export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  subscribers: number;
  joinedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  verified: boolean;
}

export interface VideoMock {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  views: number;
  publishedAt: string;
  description: string;
  channel: Channel;
  likes: number;
  comments: Comment[];
  category: string;
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
