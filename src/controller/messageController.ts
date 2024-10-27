import { Request, Response } from "express";
import { Message } from "../models/Message";
import { sendMessageSchema } from "../util/validate/channelSchema";
import { BadRequest } from "../util/AppError";

export async function sendMessage(req: Request, res: Response) {
  try {
    const { channelId, message, sender } = req.body;
    const { error } = sendMessageSchema.validate(req.body);
    if (error) throw new BadRequest(error.details[0].message);
    const newMessage = new Message({ channel_id: channelId, message, sender });
    await newMessage.save();
    res.status(201).json({ message: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channel_id: channelId });
    res.status(200).json({ message: messages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
