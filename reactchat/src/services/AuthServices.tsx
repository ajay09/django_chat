import axios from "axios";
import { AuthServiceProps } from "../@types/auth-service.d";

export function useAuthService(): AuthServiceProps {
  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("access");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/account/?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userDetails = response.data;

      localStorage.setItem("username", userDetails.username);
    } catch (error: any) {
      return console.error();
    }
  };

  const getUserIDFromToken = (token: string) => {
    const encodedPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(encodedPayload));
    const userId = decodedPayload.user_id;
    return userId;
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("userId", getUserIDFromToken(access));

      getUserDetails();

      console.log(response);
    } catch (error: any) {
      return console.error();
    }
  };

  return { login };
}
