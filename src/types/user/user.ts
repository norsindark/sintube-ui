export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  status: UserStatus;
  subscribers: number;
  handle: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfoResponse {
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  verified: boolean;
  active: boolean;
}