import express from "express";
import { deleteMessage } from "../controller/messageController";
import { authenticate } from "../middleware/authMiddleware";

const messageRouter = express.Router();

messageRouter.delete("/delete/:messageId", authenticate, deleteMessage);

export default messageRouter;
