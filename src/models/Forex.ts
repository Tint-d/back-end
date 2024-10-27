import mongoose, { Document, Schema } from "mongoose";

interface IForexData extends Document {
  pair: string;
  price: number;
  timestamp: Date;
}

const ForexDataSchema: Schema<IForexData> = new Schema({
  pair: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const ForexData = mongoose.model<IForexData>(
  "ForexData",
  ForexDataSchema
);
