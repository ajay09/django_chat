import axios from "axios";
import { AuthServiceProps } from "../@types/auth-service.d";
import { useState } from "react";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function useAuthService(): AuthServiceProps {
  const navigate = useNavigate();
  const getInitialLoggedInValue = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    return loggedIn !== null && loggedIn === "true";
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    getInitialLoggedInValue
  );

  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/account/?user_id=${userId}`,
        { withCredentials: true }
      );

      const userDetails = response.data;

      localStorage.setItem("username", userDetails.username);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } catch (error: any) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      return console.error();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      const data = response.data;
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      getUserDetails();
    } catch (error: any) {
      return console.error();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/token/refresh`,
        {},
        { withCredentials: true }
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.clear();
    try {
      const response = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (refreshError) {
      console.log(refreshError);
    }
    navigate("/login");
  };

  return { login, isLoggedIn, logout, refreshAccessToken };
}
