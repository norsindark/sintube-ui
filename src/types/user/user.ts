export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
