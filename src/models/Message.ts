import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  message: string;
  sender: mongoose.Types.ObjectId;
  channel_id: mongoose.Types.ObjectId;
  timestamp: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
  message: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  channel_id: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
