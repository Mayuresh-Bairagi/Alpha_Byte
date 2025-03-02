import axios from "axios";
import {
  setupCache,
  buildStorage,
  StorageValue,
} from "axios-cache-interceptor";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request logging in development
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// Use the proper buildStorage function
const localStorage = buildStorage({
  async find(key: string): Promise<StorageValue | undefined> {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  },

  async set(key: string, value: StorageValue): Promise<void> {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    const keys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith("axios-cache:")
    );
    keys.forEach((key) => window.localStorage.removeItem(key));
  },
});

// Add caching interceptor
const axiosWithCache = setupCache(axiosInstance, {
  ttl: CACHE_DURATION,
  storage: localStorage,
  // Other options you might want to include:
  debug: import.meta.env.MODE !== "production" ? console.log : undefined,
  methods: ["get"],
});

// Add request interceptor for authentication if needed
axiosWithCache.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = window.localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosWithCache.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          window.localStorage.removeItem("auth_token");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  get: async <T>(url: string, config = {}) => {
    try {
      const response = await axiosWithCache.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    try {
      const response = await axiosWithCache.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${url}:`, error);
      throw error;
    }
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    try {
      const response = await axiosWithCache.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${url}:`, error);
      throw error;
    }
  },

  delete: async <T>(url: string, config = {}) => {
    try {
      const response = await axiosWithCache.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${url}:`, error);
      throw error;
    }
  },

  // Clear cache for specific endpoint
  clearCache: (url: string) => {
    const cacheKey = `axios-cache:${url}`;
    window.localStorage.removeItem(cacheKey);
  },

  // Clear all cache
  clearAllCache: () => {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("axios-cache:"))
      .forEach((key) => window.localStorage.removeItem(key));
  },
};

export default api;
