import type { User, UserLiteInfoResponse } from "@/types/user/user";

export function mapUserLiteToUser(data: UserLiteInfoResponse): User {
  return {
    id: "",
    username: data.username,
    displayName: data.displayName,
    email: data.email,
    avatar: data.avatar ? "/api/users/avatar" : "",
    status: data.isActive ? "ACTIVE" : "INACTIVE",
    subscribers: 0,
    handle: data.username,
    joinedAt: "",
    createdAt: "",
    updatedAt: "",
  };
}