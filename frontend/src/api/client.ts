import axios from "axios";

export const AUTH_TOKEN_KEY = "moringa_auth_token";
export const AUTH_ROLE_KEY = "moringa_user_role";
export const AUTH_NAME_KEY = "moringa_user_name";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
