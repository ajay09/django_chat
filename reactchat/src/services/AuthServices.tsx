import axios from "axios";
import { AuthServiceProps } from "../@types/auth-service.d";
import { useState } from "react";

export function useAuthService(): AuthServiceProps {
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

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return { login, isLoggedIn, logout };
}
