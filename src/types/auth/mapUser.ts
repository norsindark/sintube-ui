import type { User, UserStatus } from "@/types/user/user";
import type { UserInfoResponse } from "@/types/auth/auth";

export function mapUser(info: UserInfoResponse): User {
  const now = new Date().toISOString();

  return {
    id: info.username,

    username: info.username,
    displayName: info.displayName,
    email: info.email,

    avatar: "",
    handle: "@" + info.username,

    subscribers: 0,

    status: mapStatus(info),

    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

function mapStatus(info: UserInfoResponse): UserStatus {
  if (info.active === false || info.isActive === false) return "INACTIVE";
  if (info.isVerified === false) return "BLOCKED";
  return "ACTIVE";
}