import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_LOGIN_ENDPOINT || "http://localhost:8070/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm accessToken vào header nếu có
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
  getTemperatureStream: async () => {
    const data = {
      deviceId: 12,
    };
    const response = await api.post("/api/sensor/temperature/stream", data);
    return response.data;
  },

  getTemperatureByDate: async (date) => {
    const response = await api.get("/api/sensor/temperature/by-date", {
      params: { date },
    });
    return response.data;
  },

  getHumidityStream: async () => {
    const data = {
      deviceId: 12,
    };
    const response = await api.post("/api/sensor/humidity/stream", data);
    return response.data;
  },

  getHumidityByDate: async (date) => {
    const response = await api.get("/api/sensor/humidity/by-date", {
      params: { date },
    });
    return response.data;
  },

  getLightStream: async () => {
    const data = {
      deviceId: 12,
    };
    const response = await api.post("/api/sensor/light/stream", data);
    return response.data;
  },

  getLightByDate: async (date) => {
    const response = await api.get("/api/sensor/light/by-date", {
      params: { date },
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
    const response = await api.post("/devicecontrol/fan/activate", controlData);
    return response.data;
  },

  controlLight: async (action, level, color) => {
    const controlData = {
      deviceId: "1",
      action: action,
      level: level,
      color: color,
    };
    const response = await api.post(
      "/devicecontrol/light/activate",
      controlData
    );
    return response.data;
  },

  controlDoor: async (action) => {
    const controlData = {
      deviceId: "user1",
      action: action,
    };
    const response = await api.post(
      "/devicecontrol/door/activate",
      controlData
    );
    return response.data;
  },
};

export default apiService;
