// services/api/authService.js
import api from "../utils/api";

export const loginService = (payload) => api.post("/auth/login", payload);
export const registerService = (payload) => api.post("/auth/register", payload);
export const meService = () => api.get("/auth/me");
