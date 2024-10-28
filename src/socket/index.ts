import { Server, Socket } from "socket.io";
import { Message } from "../models/Message";
import { ForexData } from "../models/Forex";
import { Channel } from "../models/Channel";

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
      console.log("channelId =>", channelId);

      socket.join(channelId);
      io.to(channelId).emit("userJoined", `User ${socket.id} joined`);
    });

    socket.on("leaveChannel", (channelId: string) => {
      socket.leave(channelId);
      io.to(channelId).emit("userLeft", `User ${socket.id} left`);
    });

    socket.on(
      "sendMessage",
      async (data: {
        channelId: string;
        message: string;
        senderId: string;
      }) => {
        try {
          const channel = await Channel.findById(data.channelId);
          if (!channel) {
            return socket.emit("error", { message: "Channel not found!" });
          }

          const isMember = channel.members.some(
            (member) => member.userId.toString() === data.senderId
          );
          if (!isMember) {
            return socket.emit("error", {
              message: "User is not a member of this channel!",
            });
          }

          // If the user is a member, save the message
          const newMessage = new Message({
            channel_id: data.channelId,
            message: data.message,
            sender: data.senderId,
          });
          await newMessage.save();

          // Emit the new message to the channel
          io.to(data.channelId).emit("newMessage", newMessage);
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Internal server error!" });
        }
      }
    );
  });
}
