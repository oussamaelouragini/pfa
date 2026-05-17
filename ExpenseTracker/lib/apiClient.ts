import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "@/core/constants/config";

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

console.log(`[Axios] API client created with base URL: ${API_CONFIG.BASE_URL}`);

apiClient.interceptors.request.use(
  async (config) => {
    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Axios] Request error:", error.message);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("[Axios] Network Error - server unreachable:", API_CONFIG.BASE_URL);
      return Promise.reject(new Error("Server unreachable. Make sure the backend is running."));
    }

    if (error.code === "ECONNABORTED") {
      console.error("[Axios] Request timed out");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const newToken = response.data.accessToken;
        await AsyncStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[Axios] Token refresh failed:", refreshError);
        await AsyncStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
