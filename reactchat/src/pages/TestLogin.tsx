import { useState } from "react";
import { useAuthServiceContext } from "../context/AuthContext";
import useAxiosWithInterceptor from "../helpers/jwtinterceptor";

const TestLogin = () => {
  const jwtAxios = useAxiosWithInterceptor();
  const { isLoggedIn, logout } = useAuthServiceContext();

  const [username, setUsername] = useState("");

  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("access");
      const response = await jwtAxios.get(
        `http://127.0.0.1:8000/api/account/?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userDetails = response.data;
      setUsername(userDetails.username);
      console.log(userDetails);
    } catch (error: any) {
      console.log(error);
      localStorage.clear();
      return console.error();
    }
  };

  return (
    <>
      <div>{isLoggedIn.toString()}</div>
      <div>
        <button onClick={logout}>logout</button>
        <button onClick={getUserDetails}>Get User Details</button>
      </div>
      <div>username: {username}</div>
    </>
  );
};

export default TestLogin;
