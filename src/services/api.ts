import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5003/api",
  // baseURL: "https://api.moneysquad.in/api/",
  // baseURL: "https://periodically-voluntary-copied-effectiveness.trycloudflare.com/api/",

  timeout: 60000,
  baseURL:"http://178.236.185.178:5003/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Only set Content-Type if data is not FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.response?.data?.error;

    if (message === "Invalid token" || message === "Account is inactive") {
      // 1) Clear token & any other persisted user info
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if you store user JSON
      localStorage.removeItem("userRole"); // if you store role

      // 2) Optional: show a toast / console
      // console.warn("Session expired – logging you out");

      // 3) Redirect to login (adjust path as needed)
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
