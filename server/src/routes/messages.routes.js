import { Router } from "express";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import {
  getMessagesByUserId,
  getUsersForMessages,
  sendMessages
} from "../controllers/messages.controller.js";
import upload from "../middlewares/multer.middleware.js";

const messagesRouter = Router();

messagesRouter.get("/users", verifyJwt, getUsersForMessages);
messagesRouter.get("/:id", verifyJwt, getMessagesByUserId);
messagesRouter.post(
  "/send/:id",
  upload.single("file"),
  verifyJwt,
  sendMessages
);

export default messagesRouter;
