import mongoose, { Document, Schema } from "mongoose";

interface IMember {
  userId: mongoose.Types.ObjectId;
  role: "admin" | "trader" | "guest";
}

interface IInvitedUser {
  userId: mongoose.Types.ObjectId; // Reference to the User
  status: "pending" | "accepted" | "declined"; // Invitation status
}
interface IChannel extends Document {
  name: string;
  created_by: mongoose.Types.ObjectId;
  members: IMember[];
  isPrivate: boolean;
  invitedUsers: IInvitedUser[];
}

const ChannelSchema: Schema<IChannel> = new Schema({
  name: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["admin", "trader", "guest"],
        default: "guest",
      },
    },
  ],
  isPrivate: { type: Boolean, default: false },
  invitedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }, // User ID is required
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending", // Default status is pending
      },
    },
  ],
});

export const Channel = mongoose.model<IChannel>("Channel", ChannelSchema);
