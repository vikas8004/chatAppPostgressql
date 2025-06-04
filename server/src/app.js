import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messagesRouter from "./routes/messages.routes.js";
import { app } from "./lib/socket.js";

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatty-2zlb.onrender.com"], // Adjust this to your frontend URL
    credentials: true,
    allowedHeaders: "Content-Type, Authorization"
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/messages", messagesRouter);

app.use((err, req, res, next) => {
  console.log("from err first middleware", err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

export default app;
