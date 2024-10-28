import { Request, Response } from "express";
import { Message } from "../models/Message";
import { sendMessageSchema } from "../util/validate/channelSchema";
import { BadRequest, Forbidden, NotFound } from "../util/AppError";
import { Channel } from "../models/Channel";

export async function sendMessage(req: Request, res: Response) {
  try {
    const { channelId, message, sender } = req.body;
    const { error } = sendMessageSchema.validate(req.body);
    if (error) throw new BadRequest(error.details[0].message);

    const channel = await Channel.findById(channelId);
    if (!channel) {
      throw new NotFound("Channel not found!");
    }

    const isMember = channel.members.some(
      (member) => member.userId.toString() === sender
    );
    if (!isMember) {
      throw new Forbidden("User is not a member of this channel!");
    }

    const newMessage = new Message({ channel_id: channelId, message, sender });
    await newMessage.save();
    res.status(201).json({ message: newMessage });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error!" });
  }
}

export async function allMessage(req: Request, res: Response) {
  try {
    const messages = await Message.find();
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    const userId = (req as any).user.id;

    const message = await Message.findById(messageId);

    if (!message) throw new NotFound("Message not found");

    if (message.sender.toString() !== userId) {
      throw new Forbidden("You are not authorized to delete this message");
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { channelId } = req.params;

    if (!channelId) throw new NotFound("Channel not found");

    const messages = await Message.find({ channel_id: channelId })
      .populate("sender", "username")
      .exec();

    const messagesWithSenderName = messages.map((message) => ({
      id: message._id,
      message: message.message,
      sender_name: (message.sender as any).username,
      timestamp: message.timestamp,
    }));

    res.status(200).json({ message: messagesWithSenderName });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
