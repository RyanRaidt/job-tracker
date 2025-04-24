import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://job-tracker-backend-vbji.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session cookies
});

export default api;
