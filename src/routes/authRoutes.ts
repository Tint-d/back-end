import express from "express";
import { login, register } from "../controller/authController";

const authrRouter = express.Router();

authrRouter.post("/register", register);
authrRouter.post("/login", login);

export default authrRouter;
