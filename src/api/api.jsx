import axios from "axios";

const API_BASE_URL =
  //   import.meta.env.VITE_BACKEND_LOGIN_ENDPOINT || "http://localhost:8070/api";
  "https://webhook.site/d84d1d54-3cbf-4949-8dac-0b95aace2313";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // User APIs
  login: async (credentials) => {
    const response = await api.post("/api/user/login", credentials);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/api/user/test/getUser");
    return response.data;
  },

  testUser: async () => {
    const response = await api.get("/api/user/test");
    return response.data;
  },

  // Voice Command API
  sendVoiceCommand: async (command) => {
    const response = await api.post("/api/voice-command", { command });
    return response.data;
  },

  // Home APIs
  addHome: async (homeData) => {
    const response = await api.post("/api/home/add", homeData);
    return response.data;
  },

  testHome: async () => {
    const response = await api.get("/api/home/test");
    return response.data;
  },

  // Employee APIs
  addUser: async (userData) => {
    const response = await api.post("/api/employee/adduser", userData);
    return response.data;
  },

  addHomeEmployee: async (homeData) => {
    const response = await api.post("/api/employee/addhome", homeData);
    return response.data;
  },

  addDevice: async (deviceData) => {
    const response = await api.post("/api/employee/add_device", deviceData);
    return response.data;
  },

  // Temperature API
  getTemperatureStream: async (deviceId) => {
    const response = await api.get("/api/temperature/stream", {
      params: { deviceId },
    });
    return response.data;
  },
  getHumidityStream: async (deviceId) => {
    const response = await api.get("/api/humidity/stream", {
      params: { deviceId },
    });
    return response.data;
  },
  getLightStream: async (deviceId) => {
    const response = await api.get("/api/light/stream", {
      params: { deviceId },
    });
    return response.data;
  },

  // Face APIs
  getFace: async () => {
    const response = await api.get("/api/face/");
    return response.data;
  },

  getFaceEmbedding: async () => {
    const response = await api.get("/api/face/test/get_embedding");
    return response.data;
  },

  sendFaceEmbedding: async (embeddingData) => {
    const response = await api.post(
      "/api/face/server/send_embedding",
      embeddingData
    );
    return response.data;
  },

  // Device Control API
  controlFan: async (action, level) => {
    const controlData = {
      deviceId: "1",
      action: action,
      level: level,
    };
    const response = await api.post("/device/fan/activate", controlData);
    return response.data;
  },
  controlLight: async (action, level, color) => {
    const controlData = {
      deviceId: "1",
      action: action,
      level: level,
      color: color,
    };
    const response = await api.post("/device/light/activate", controlData);
    return response.data;
  },
  controlDoor: async (action) => {
    const controlData = {
      deviceId: "1",
      action: action,
    };
    const response = await api.post("/device/door/activate", controlData);
    return response.data;
  },
};

export default apiService;
