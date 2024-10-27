import { Request, Response } from "express";
import { Channel } from "../models/Channel";
import { createChannelSchema } from "../util/validate/channelSchema";
import { BadRequest, Forbidden, NotFound } from "../util/AppError";
import { User } from "../models/User";
import mongoose from "mongoose";
import { getIO } from "../server";
import { Notification } from "../models/Notifications";

// Create a new channel (Admins only)
export const createChannel = async (req: Request, res: Response) => {
  const { error } = createChannelSchema.validate(req.body);
  if (error) throw new BadRequest(error.details[0].message);

  const { name, isPrivate } = req.body;

  const created_by = (req as any).user._id;
  const userId = (req as any).user._id;
  const newChannel = new Channel({
    name,
    created_by,
    isPrivate,
    members: [{ userId, role: "admin" }],
  });

  await newChannel.save();

  const creator = await User.findById(created_by).select("username");
  const member = await User.findById(userId).select("username");

  res.status(201).json({
    success: true,
    message: "Channel created successfully",
    channel: {
      name: newChannel.name,
      created_by: creator ? creator.username : null,
      members: member
        ? [
            {
              role: "admin",
              member_name: member.username,
              _id: member._id,
            },
          ]
        : [],
      isPrivate: newChannel.isPrivate,
      _id: newChannel._id,
    },
  });
};

// View public channels (Admins, Traders, and Guests)
export const viewChannels = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  const channels = await Channel.find({
    $or: [{ created_by: userId }, { isPrivate: false }],
  });

  res.status(200).json({ success: true, channels });
};

// join channel
export const joinChannel = async (req: Request, res: Response) => {
  const { channelId } = req.body;

  const user = (await User.findById(
    (req as any).user._id
  )) as mongoose.Types.ObjectId | null;

  if (!user) throw new NotFound("User not found.");

  const channel = await Channel.findById(channelId);

  if (!channel) throw new NotFound("Channel not found.");

  // If the channel is private, check if the user is already a member
  if (channel.isPrivate) {
    const existingMember = channel.members.find(
      (member) => member.userId.toString() === user.toString()
    );
    if (existingMember) {
      throw new BadRequest("You are already a member of this channel.");
    }
    const invitedUser = channel.invitedUsers.find(
      (invitedId) => invitedId.toString() === user._id.toString()
    );

    if (!invitedUser) {
      throw new Forbidden("You need to be invited to join this channel.");
    }
  }

  // Add user to the channel's members
  const anotherExistingMember = channel.members.find(
    (member) => member.userId.toString() === user._id.toString()
  );
  if (anotherExistingMember)
    throw new BadRequest("User already exist in this channel!");

  if (!anotherExistingMember) {
    channel.members.push({ userId: user, role: "trader" }); // Default role as trader
    await channel.save();
  }

  res.status(200).json({ message: "Joined channel successfully." });
};

// invition  channel
export const inviteToChannel = async (req: Request, res: Response) => {
  const { channelId, userId } = req.body;
  const io = getIO();

  const inviter = (await User.findById(
    (req as any).user._id
  )) as mongoose.Types.ObjectId | null;
  if (!inviter) throw new NotFound("Inviter not found.");

  const channel = await Channel.findById(channelId);
  if (!channel) throw new NotFound("Channel not found.");

  const existingMember = channel.members.find(
    (member) => member.userId.toString() === inviter._id.toString()
  );
  if (!existingMember)
    throw new Forbidden("You are not a member of this channel.");

  const invitedUser = (await User.findById(
    userId
  )) as mongoose.Types.ObjectId | null;
  if (!invitedUser) throw new NotFound("User to invite not found.");

  const alreadyMember = channel.members.find(
    (member) => member.userId.toString() === invitedUser._id.toString()
  );
  if (alreadyMember) {
    throw new BadRequest("User is already a member of this channel.");
  }

  channel.invitedUsers.push({ userId: userId, status: "pending" });
  await channel.save();

  const notification = new Notification({
    userId: invitedUser._id,
    message: `You have been invited to join the channel "${channel.name}".`,
    channelId: channelId,
  });

  await notification.save();

  io.to(userId).emit("invitation", {
    message: `You have been invited to join the channel "${channel.name}".`,
    channelId: channelId,
  });

  res
    .status(200)
    .json({ message: "User invited to the channel successfully." });
};

// Send Notifications on Acceptance
export const acceptInvitation = async (req: Request, res: Response) => {
  const { channelId } = req.body;
  const userId = (req as any).user._id;
  const io = getIO();

  const channel = await Channel.findById(channelId);

  if (!channel) throw new NotFound("Channel not found.");

  const invitedUser = channel.invitedUsers.find(
    (invite) => invite.userId.toString() === userId
  );

  if (!invitedUser)
    throw new BadRequest("You have not been invited to this channel.");

  // Update status to accepted
  invitedUser.status = "accepted";

  // Add the user to members
  channel.members.push({ userId: userId, role: "trader" });

  await channel.save();

  const notification = await Notification.findOneAndUpdate(
    { userId: userId, channelId: channelId, isRead: false },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    console.log("No unread notification found.");
  }

  io.to(channel.created_by.toString()).emit("invitationAccepted", {
    message: `${invitedUser.userId} has accepted your invitation to the channel "${channel.name}".`,
    channelId: channelId,
  });

  res
    .status(200)
    .json({ message: "Invitation accepted and you have joined the channel." });
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({ notifications });
};

export const deleteChannel = async (req: Request, res: Response) => {
  const { channelId } = req.params;

  try {
    const deletedChannel = await Channel.findByIdAndDelete(channelId);
    if (!deletedChannel) throw new NotFound("Channel not found");

    res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error deleting channel",
    });
  }
};
