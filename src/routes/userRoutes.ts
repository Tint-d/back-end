import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  searchUsers,
  updateUser,
} from "../controller/userController";
import { authenticate } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post("/create", authenticate, createUser);
userRouter.get("/", authenticate, getUsers);
userRouter.get("/detail/:id", authenticate, getUser);
userRouter.put("/update/:id", authenticate, updateUser);
userRouter.delete("/delete/:id", authenticate, deleteUser);
userRouter.get("/search", authenticate, searchUsers);

export default userRouter;
