import axios, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const API_BASE_URL = BASE_URL

const useAxiosWithInterceptor = (): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: API_BASE_URL});
    const navigate = useNavigate();

    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            // if (error.response?.status === 403) {
            //     const goRoot = () => navigate("/test")
            //     goRoot();
            // }
            if (error.response?.status === 401) {
                const refreshToken = localStorage.getItem("refresh");
                if (refreshToken) {
                    try {
                        const refreshResponse = await axios.post(
                            "http://127.0.0.1:8000/api/token/refresh",
                            {
                                refresh: refreshToken
                            }
                        );
                        const newAccessToken = refreshResponse.data.access;
                        originalRequest.headers["Authorization"]  = `Bearer ${newAccessToken}`;
                        localStorage.setItem("access", newAccessToken);
                        return jwtAxios(originalRequest);
                    } catch (error) {
                        navigate('/login');
                    }
                }
            } else {
                navigate('/login')
            }
            throw error;
        }
    )
    return jwtAxios;
}

export default useAxiosWithInterceptor