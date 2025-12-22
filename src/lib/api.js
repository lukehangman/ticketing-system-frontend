import axios from "axios";

// ===== BASE URL SETUP =====
// Always rely on NEXT_PUBLIC_API_URL (no localhost fallback)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
// Automatically attach Bearer token for authenticated requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====layout
// Handles expired tokens + unauthorized redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Token expired or user is unauthorized
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
