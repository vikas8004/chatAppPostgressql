import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  isAuthenticated
} from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const authRouter = express.Router();

authRouter.post("/signup", upload.single("file"), register);
authRouter.post("/login", login);
authRouter.get("/logout", verifyJwt, logout);
authRouter.put("/profile", upload.single("file"), verifyJwt, updateProfile);

authRouter.get("/checkauth", verifyJwt, isAuthenticated);

export default authRouter;
