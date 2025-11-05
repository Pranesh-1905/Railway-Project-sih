// utils/apiClient.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * NOTE:
 * - On Android emulator, use http://10.0.2.2:8000
 * - On iOS simulator use http://localhost:8000
 * - On physical device replace with your machine IP (e.g. http://192.168.x.y:8000)
 */
const BASE_URL = "http://10.151.236.168:8000"; // change if needed

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
