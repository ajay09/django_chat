import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    useTheme,
    ListItemIcon,
    Typography,
  } from "@mui/material";
  import { Link } from "react-router-dom";
  import ListItemAvatar from "@mui/material/ListItemAvatar";
  import { MEDIA_URL } from "../../config";
  import { Server } from "../../@types/server";
  import { useParams } from "react-router-dom";
  


  interface ServerChannelsProps {
    data: Server[];
  };
  
  
  const ServerChannels = (props: ServerChannelsProps) => {
    const { data } = props;
    const theme = useTheme();
    const server_name = data?.[0]?.name ?? "Server"; 
    const {serverId} = useParams();
  
    return (
      <>
        <Box
          sx={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            px: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            position: "sticky",
            top: 0,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="body1" style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap",}}> {server_name} </Typography>
        </Box>
        <List sx={{ py: 0 }}>
          {data?.flatMap((obj) => obj.channel_server.map((item) => (
            <ListItem
              disablePadding
              key={item.id}
              sx={{ display: "block", maxHeight: "40px" }}
              dense={true}
            >
            <Link
              to={`/server/${serverId}/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "0px" }}>
                    <img
                      alt="server Icon"
                      src={`${MEDIA_URL}${item.icon}`}
                      style={{
                        width: "25px",
                        height: "25px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      textAlign="start"
                      paddingLeft={1}
                    >
                      {item.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
          ))
        )}
        </List>
      </>
    );
  };
  
  export default ServerChannels;
  