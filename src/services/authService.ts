import { apiClient } from "./api/apiClient";
import { apiRoutes } from "./api/apiRoute";

import type {
  IdentifyRequest,
  IdentifyResponse,
  VerifyPasswordRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth/auth";

export const authService = {
  async identify(payload: IdentifyRequest): Promise<IdentifyResponse> {
    const { data } = await apiClient.post<IdentifyResponse>(
      apiRoutes.auth.identify,
      payload,
      {
        skipAuth: true,
      }
    );

    return data;
  },

  async verifyPassword(payload: VerifyPasswordRequest) {
    const { data } = await apiClient.post<LoginResponse>(
      apiRoutes.auth.verifyPassword,
      payload,
      {
        usePasswordToken: true,
      }
    );

    return data;
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>(
      apiRoutes.auth.register,
      payload,
      {
        skipAuth: true,
      }
    );

    return data;
  },
};