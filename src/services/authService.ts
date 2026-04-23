import { apiClient, delay } from "./apiClient";
import { makeUserFromEmail } from "./mockData";
import type { User } from "@/types";

void apiClient;

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    await delay(400);
    return makeUserFromEmail(email);
  },
  async register(name: string, email: string, _password: string): Promise<User> {
    await delay(400);
    return makeUserFromEmail(email, name);
  },
};
