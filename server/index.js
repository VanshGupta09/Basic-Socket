import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: ".env" });

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
)

app.get("/", (req, res) => {
    res.status(200).send("Working!");
});

const secretKey = "secretKey";

app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "qwertyuiop" }, secretKey)

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" }).send("Login success")
});

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)

        const token = socket.request.cookies.token;
        if (!token) return next(new Error("Authentication Error"))

        const decoded = jwt.verify(token, secretKey);
        next()
    });

})

io.on("connection", (socket) => {

    console.log("User connected id:", socket.id);

    socket.emit("welcome", `Welcome to server`)

    socket.broadcast.emit("welcome", `${socket.id} joined the server`)

    socket.on("disconnect", () => {
        console.log(`${socket.id} user disconnected`);
    })

    socket.on("message", ({ msg, room }) => {
        io.to(room).emit("recive-msg", msg)
    })

    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`User joined room: ${room}`);
    })

})

server.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})