import express from "express";
import { login, refreshToken, register } from "../controller/authController";

const authrRouter = express.Router();

authrRouter.post("/register", register);
authrRouter.post("/login", login);
authrRouter.post("/refresh-token", refreshToken);

export default authrRouter;
