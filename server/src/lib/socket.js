import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Adjust this to your frontend URL
    credentials: true
  }
});

export function GetReceiverSocketId(user_id) {
  return onlineUserMaps[user_id];
}
//object for storing the online user info
const onlineUserMaps = {};
io.on("connection", socket => {
  console.log("A user connected:", socket.id);
  const user_id = socket.handshake.query.user_id;
  if (user_id) onlineUserMaps[user_id] = socket.id;

  // Notify other users about the new connection
  io.emit("getOnlineUsers", Object.keys(onlineUserMaps));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove the user from the onlineUserMaps
    delete onlineUserMaps[user_id];
    // Notify other users about the disconnection
    io.emit("getOnlineUsers", Object.keys(onlineUserMaps));
  });
});

export { io, app, server };
