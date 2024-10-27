import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/userController";
import { authenticate } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post("/create", authenticate, createUser);
userRouter.get("/", getUsers);
userRouter.get("/detail/:id", authenticate, getUser);
userRouter.put("/update/:id", authenticate, updateUser);
userRouter.delete("/delete/:id", authenticate, deleteUser);

export default userRouter;
