import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      setError(null);
      const response = await api.get("/api/auth/status", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });


      console.log("Auth status response:", response.data);

      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setError(
        error.response?.data?.message || "Failed to check authentication status"
      );
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post("/api/auth/login", credentials);
      await checkAuthStatus();
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post("/api/auth/register", userData);
      await checkAuthStatus();
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error.response?.data?.message || "Logout failed");
      // Still clear the user state even if the server request fails
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
