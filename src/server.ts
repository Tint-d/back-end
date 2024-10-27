import express, { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import { notFound } from "./middleware/notFoundError";
import authrRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import channelRouter from "./routes/channelRoute";
import { setupSocket } from "./socket";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const initializeConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
};

app.use("/api/v1/auth", authrRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/channels", channelRouter);

app.use(notFound);
app.use(errorHandler as unknown as ErrorRequestHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized.");
  }
  return io;
};

setupSocket(io);

// Start the server
app.listen(PORT, async () => {
  await initializeConfig();
  console.log(`Server is running on port ${PORT}`);
});
