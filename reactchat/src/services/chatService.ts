import useWebSocket from "react-use-websocket";
import useCrud from "../hooks/useCrud";
import { Server } from "../@types/server";
import { useAuthService } from "./AuthServices";
import { useState } from "react";
import { WS_URL } from "../config";

interface MessageContent {
  type: string;
  message: string;
}

interface Message {
  sender: string;
  content: MessageContent;
  timestamp: string;
}

const useChatWebSocket = (serverId: string, channelId: string) => {
  const { logout, refreshAccessToken } = useAuthService();
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const maxConnectionAttempts = 4;
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { fetchData } = useCrud<Server>(
    [],
    `/messages/?channel_id=${channelId}`
  );

  const socketUrl = channelId
    ? `${WS_URL}/${serverId}/${channelId}`
    : null;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected!!!");
      } catch (error) {
        console.log(error);
      }
    },
    onClose: (event: CloseEvent) => {
      if (event.code == 4001) {
        console.log("Authentication Error!");
        refreshAccessToken().catch((error) => {
          if (error.response && error.response.status == 401) {
            logout();
          }
        });
      }
      console.log("Closed!");
      setReconnectionAttempt((prevAttempt) => prevAttempt + 1);
    },
    onError: () => {
      console.log("Error!");
    },
    onMessage: (msg) => {
      // On getting the message.
      const data = JSON.parse(msg.data);
      setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
      setMessage("");
    },
    shouldReconnect: (closeEvent) => {
      if (
        closeEvent.code === 4001 &&
        reconnectionAttempt >= maxConnectionAttempts
      ) {
        setReconnectionAttempt(0);
        return false;
      }
      return true;
    },
    reconnectInterval: 1000,
  });

  return {
    newMessage,
    message,
    setMessage,
    sendJsonMessage,
  }
};

export default useChatWebSocket;
