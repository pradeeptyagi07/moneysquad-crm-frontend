import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5003/api",
  // baseURL: "https://api.moneysquad.in/api/",
  // baseURL: "https://articles-task-volume-headset.trycloudflare.com/api",
baseURL:"http://178.236.185.178:5003/api",


  timeout: 60000,
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
    const message = error.response?.data?.message;

    if (status === 401) {
      // 1) Clear token & any other persisted user info
      localStorage.removeItem("token");
      localStorage.removeItem("user");      // if you store user JSON
      localStorage.removeItem("userRole");  // if you store role

      // 2) Optional: show a toast / console
      // console.warn("Session expired – logging you out");

      // 3) Redirect to login (adjust path as needed)
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
