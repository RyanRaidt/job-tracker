import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/api/auth/status");
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth status check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = "/auth/linkedin";
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear the user state even if the server request fails
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
