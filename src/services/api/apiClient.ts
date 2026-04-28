import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { tokenManager } from "@/lib/auth/tokenManager";

declare module "axios" {
  export interface AxiosRequestConfig {
    usePasswordToken?: boolean;
    skipAuth?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  if (config.skipAuth) {
    return config;
  }

  if (config.usePasswordToken) {
    const token = tokenManager.getPasswordVerificationToken();

    if (token) {
      config.headers.Authorization = token;
    }
  } else {
    const token = tokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = token;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected error";

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export const delay = (ms = 1) =>
  new Promise((r) => setTimeout(r, ms));