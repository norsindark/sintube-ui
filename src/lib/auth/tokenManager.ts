const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const PASSWORD_VERIFICATION_TOKEN_KEY = "passwordVerificationToken";

function setWithTTL(key: string, value: string, ttlMs: number) {
  const data = {
    value,
    expireAt: Date.now() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function getWithTTL(key: string): string | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);

    if (!data.expireAt || Date.now() > data.expireAt) {
      localStorage.removeItem(key);
      return null;
    }

    return data.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export const tokenManager = {
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  setPasswordVerificationToken(token: string) {
    setWithTTL(PASSWORD_VERIFICATION_TOKEN_KEY, token, 10 * 60 * 1000);
  },

  getPasswordVerificationToken(): string | null {
    return getWithTTL(PASSWORD_VERIFICATION_TOKEN_KEY);
  },

  removePasswordVerificationToken() {
    localStorage.removeItem(PASSWORD_VERIFICATION_TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PASSWORD_VERIFICATION_TOKEN_KEY);
  },
};