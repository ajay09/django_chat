import React, { useState } from "react";
import { Server } from "../../@types/server.d";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  TextField,
} from "@mui/material";
import MessageInterfaceChannels from "./MessageInterfaceChannels";
import Scroll from "./Scroll";
import { useParams } from "react-router-dom";
import useChatWebSocket from "../../services/chatService";

interface ServerChannelProps {
  data: Server[];
}

interface SendMessageData {
  type: string;
  message: string;
  [key: string]: any;
}

interface MessageContent {
  type: string;
  message: string;
}

interface Message {
  sender: string;
  content: MessageContent;
  timestamp: string;
}

const messageInterface = (props: ServerChannelProps) => {
  const { data } = props;
  const theme = useTheme();
  const { serverId, channelId } = useParams();
  const server_name = data?.[0]?.name ?? "Server";
  const {newMessage, message, setMessage, sendJsonMessage} = useChatWebSocket(serverId || "", channelId || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({
      type: "message",
      message,
    } as SendMessageData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.length > 0) {
        sendJsonMessage({
          type: "message",
          message,
        } as SendMessageData);
      }
    }
  };

  function formatTimeStamp(timestamp: string): string {
    const date = new Date(Date.parse(timestamp));
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} at ${formattedTime}`;
  }

  return (
    <>
      <MessageInterfaceChannels data={data} />
      {channelId == undefined ? (
        <Box
          sx={{
            overflow: "hidden",
            p: { xs: 0 },
            height: `calc(80vh)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} letterSpacing={"-0.5px"}>
              Welcome to {server_name}
            </Typography>
            <Typography>
              {data?.[0]?.description ?? "This is our home"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              overflow: "hidden",
              p: 0,
              height: `calc(100vh - 100px - 90px)`,
            }}
          >
            <Scroll>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {newMessage.map((msg: Message, index: number) => {
                  return (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="user image" />
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "12px",
                          variant: "body2",
                        }}
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="body1"
                              color="text.primary"
                              sx={{ display: "inline", fontW: 600 }}
                            >
                              {msg.sender}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {"   "} {formatTimeStamp(msg.timestamp)}
                            </Typography>
                          </>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              variant="body1"
                              style={{
                                overflow: "visible",
                                whiteSpace: "normal",
                                textOverflow: "clip",
                              }}
                              sx={{
                                display: "inline",
                                lineHeight: 1.2,
                                fontWeight: 400,
                                letterSpacing: "-0.2px",
                              }}
                              component="span"
                              color="text.primary"
                            >
                              {msg.content.message}
                            </Typography>
                          </React.Fragment>
                        }
                      ></ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Scroll>
          </Box>
          <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              style={{
                bottom: 0,
                right: 0,
                padding: "1rem",
                backgroundColor: theme.palette.background.default,
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  multiline
                  value={message}
                  minRows={1}
                  maxRows={4}
                  sx={{ flexGrow: 1, paddingBottom: "10px" }}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Box>
            </form>
          </Box>
        </>
      )}
    </>
  );
};
export default messageInterface;
