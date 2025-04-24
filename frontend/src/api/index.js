import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://job-tracker-backend-vbji.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session cookies
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
