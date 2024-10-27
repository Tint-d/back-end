import express from "express";
import {
  canViewPublicChannel,
  isAdmin,
  isTraderOrHigher,
} from "../middleware/roleMiddleware";
import {
  acceptInvitation,
  createChannel,
  deleteChannel,
  getNotifications,
  inviteToChannel,
  joinChannel,
  viewChannels,
} from "../controller/channelController";
import { sendMessage } from "../controller/messageController";
import { authenticate } from "../middleware/authMiddleware";

const channelRouter = express.Router();

channelRouter.post("/create", authenticate, createChannel);
channelRouter.get("/view", authenticate, canViewPublicChannel, viewChannels);
channelRouter.post("/send", authenticate, isTraderOrHigher, sendMessage);
channelRouter.delete("/delete/:id", authenticate, isAdmin, deleteChannel);
channelRouter.get("/notifications", authenticate, getNotifications);
channelRouter.post("/join-channel", authenticate, joinChannel);
channelRouter.post("/invite-channel", authenticate, inviteToChannel);
channelRouter.post("/accept-channel", authenticate, acceptInvitation);

export default channelRouter;
