import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  channelId: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
