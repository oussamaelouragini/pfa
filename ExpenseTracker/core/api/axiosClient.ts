import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // from your .env file
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = ""; // later: get from AsyncStorage or AuthProvider
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
