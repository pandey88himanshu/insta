import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";
const app = express();
const server = http.createServer(app);

dotenv.config();
const io = new Server(server, {
  cors: {
    origin: process.env.URL, // Fixed CORS URL without leading space
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // This map stores socket id corresponding to the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  console.log("New connection:", userId); // Log the connected userId for debugging

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
