import axios from "axios";

const getBaseUrl = () => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL ||
      "https://job-tracker-backend-vbji.onrender.com"
    );
  }
  // In development, use localhost
  return "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include credentials
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
