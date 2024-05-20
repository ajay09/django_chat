import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { useAuthService } from "../services/AuthServices";

const API_BASE_URL = BASE_URL;

const useAxiosWithInterceptor = (): AxiosInstance => {
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });
  const navigate = useNavigate();
  const { logout } = useAuthService();

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 403) {
        const goRoot = () => navigate("/test");
        goRoot();
      }
      if (error.response?.status === 401) {
        try {
          axios.defaults.withCredentials = true;
          const refreshResponse = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh",
            {},
            { withCredentials: true }
          );
          if (refreshResponse["status"] == 200) {
            return jwtAxios(originalRequest);
          }
        } catch (refreshError) {
          logout();
          const goLogin = () => { navigate("/login")};
          goLogin();
          return Promise.reject(refreshError);
        }
      } else {
        logout();
      }
      throw error;
    }
  );
  return jwtAxios;
};

export default useAxiosWithInterceptor;
