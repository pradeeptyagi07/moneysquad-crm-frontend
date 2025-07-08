import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://178.236.185.187:5002/api",
  // baseURL: "https://api.moneysquad.in/api/",
  // baseURL: "https://skilled-linux-demanding-diabetes.trycloudflare.com/api",
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
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
