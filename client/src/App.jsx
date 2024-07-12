import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(
    () => io("https://basic-socket-1.onrender.com", { withCredentials: true }),
    []
  );

  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { msg, room });
    setMsg("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    // socket.on("welcome", (a) => {
    //   console.log(a);
    // });

    // socket.on("disconnect", (a) => {
    //   console.log(a);
    // });

    socket.on("recive-msg", (data) => {
      console.log(data);
      setMessages((msgs) => [...msgs, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <Typography
          variant="h5"
          component={"div"}
          gutterBottom
          textAlign={"center"}
        >
          Basics of Socket.io
        </Typography>
        <Typography textAlign={"center"}>{socketId}</Typography>
        <form onSubmit={joinRoomHandler}>
          <Stack>
            <Typography variant="h6" textAlign={"center"}>
              Join Room
            </Typography>
            <TextField
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              id="outlined-basic"
              label="Room Name"
              variant="outlined"
              sx={{ margin: "10px 0" }}
            />
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Stack>
        </form>
        <form onSubmit={submitHandler}>
          <Stack>
            <TextField
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              id="outlined-basic"
              label="Message"
              variant="outlined"
              sx={{ margin: "10px 0" }}
            />
            <TextField
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              id="outlined-basic"
              label="Room"
              variant="outlined"
              sx={{ margin: "10px 0" }}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Stack>
        </form>
        <Stack>
          {messages?.map((elm, ind) => (
            <Typography key={ind} textAlign={"center"} sx={{ margin: "5px 0" }}>
              {elm}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default App;
