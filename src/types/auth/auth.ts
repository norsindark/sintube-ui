import type { User } from "@/types/user/user";

export type AuthFlowStatus =
  | "IDENTIFIED"
  | "WAITING_FOR_PASSWORD"
  | "COMPLETED";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface IdentifyRequest {
  identifier: string;
}

export interface IdentifyResponse {
  userInfo: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  status: AuthFlowStatus;
  passwordVerificationToken: string;
}

export interface VerifyPasswordRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}