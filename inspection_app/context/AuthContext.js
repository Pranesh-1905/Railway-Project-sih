// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ role: null, username: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token = await AsyncStorage.getItem("token");
        
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          try {
            // Try to get user info from API
            const response = await api.get("/auth/me");
            if (response.data && response.status === 200) {
              setAuth({
                role: response.data.role,
                username: response.data.username,
              });
            } else {
              setAuth({ role: null, username: null });
            }
          } catch (apiError) {
            // Clear invalid token
            await AsyncStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            setAuth({ role: null, username: null });
          }
        } else {
          setAuth({ role: null, username: null });
        }
      } catch (error) {
        setAuth({ role: null, username: null });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = async (username, password, role) => {
    try {
      const res = await api.post("/auth/login", { username, password, role });
      const { access_token, user } = res.data;
      if (!access_token) throw new Error("No token received");
      await AsyncStorage.setItem("token", access_token);
      setAuth({ role: user.role, username: user.username });
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      return user;
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      ToastAndroid.show("Logged out", ToastAndroid.SHORT);
    } catch (err) {
      console.log("Logout failed:", err.message || err);
    } finally {
      setAuth({ role: null, username: null });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};