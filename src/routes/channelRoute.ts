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
  getChannelDetail,
  getNotifications,
  inviteToChannel,
  joinChannel,
  viewChannels,
} from "../controller/channelController";
import {
  allMessage,
  getMessages,
  sendMessage,
} from "../controller/messageController";
import { authenticate } from "../middleware/authMiddleware";

const channelRouter = express.Router();

channelRouter.post("/create", authenticate, createChannel);
channelRouter.get("/view", authenticate, canViewPublicChannel, viewChannels);
channelRouter.post("/send", authenticate, isTraderOrHigher, sendMessage);
channelRouter.delete("/delete/:id", authenticate, isAdmin, deleteChannel);
channelRouter.get("/detail/:channelId", authenticate, getChannelDetail);
channelRouter.get("/notifications", authenticate, getNotifications);
channelRouter.post("/join-channel", authenticate, joinChannel);
channelRouter.post("/invite-channel", authenticate, inviteToChannel);
channelRouter.post("/accept-channel", authenticate, acceptInvitation);
channelRouter.get("/:channelId/messages", authenticate, getMessages);
channelRouter.get("/all-message", authenticate, allMessage);

export default channelRouter;
