import { Server, Socket } from "socket.io";
import { Message } from "../models/Message";
import { ForexData } from "../models/Forex";

export function setupSocket(io: Server) {
  setInterval(async () => {
    const randomPrice = Math.random() * 100;
    const forexData = new ForexData({ pair: "USD/EUR", price: randomPrice });
    await forexData.save();
    io.to("Trading").emit("forexUpdate", forexData);
  }, 5000);

  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id);

    socket.on("joinChannel", (channelId: string) => {
      socket.join(channelId);
      io.to(channelId).emit("userJoined", `User ${socket.id} joined`);
    });

    socket.on("leaveChannel", (channelId: string) => {
      socket.leave(channelId);
      io.to(channelId).emit("userLeft", `User ${socket.id} left`);
    });

    socket.on(
      "sendMessage",
      async (data: { channelId: string; message: string; sender: string }) => {
        const newMessage = new Message({
          channel_id: data.channelId,
          message: data.message,
          sender: data.sender,
        });
        await newMessage.save();
        io.to(data.channelId).emit("newMessage", newMessage);
      }
    );
  });
}
