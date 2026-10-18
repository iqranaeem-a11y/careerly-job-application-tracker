import axios from "axios";

export const TOKEN_STORAGE_KEY = "careerly_access_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
    if (!error.response) {
      return `Can't reach the API at ${error.config?.baseURL ?? api.defaults.baseURL}. Start the server and check its database configuration.`;
    }
    return error.response?.data.error?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
};
