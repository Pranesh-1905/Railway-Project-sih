import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ role: null, username: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthData() {
      try {
        const { data } = await api.get("/auth/me");
        if (data) {
          setAuth({ role: data.role, username: data.username });
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        setAuth({ role: null, username: null });
      } finally {
        setLoading(false);
      }
    }
    fetchAuthData();
  }, []);

  const login = async (username, password, role) => {
    try {
      const res = await api.post("/auth/login", { username, password, role });
      const user = res.data.user || {};
      setAuth({ role: user.role, username: user.username });
      
      // Navigate based on role
      switch (user.role) {
        case "MANUFACTURER":
          window.location.href = "/manufacturer/dashboard";
          break;
        case "QUALITY_INSPECTOR":
          window.location.href = "/quality_inspector/dashboard";
          break;
        case "WAREHOUSE_MANAGER":
          window.location.href = "/warehouse_manager/dashboard";
          break;
        default:
          window.location.href = "/dashboard";
      }
    } catch (err) {
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setAuth({ role: null, username: null });
    }
  };

  const manufacturerdetails = async () => {
    try {
      const { data } = await api.get("/manufacturer/mydetails");
      return data;
    } catch (error) {
      console.log("Failed to fetch manufacturer details:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, loading, manufacturerdetails }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function   useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
