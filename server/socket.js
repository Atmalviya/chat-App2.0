const MessagesModel = require("./models/MessagesModel");
const ChannelModel = require("./models/ChannelModel");
require('dotenv').config()
const socketIoServer = require("socket.io").Server;


const setupSocket = (server) => {
  const io = new socketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await MessagesModel.create(message);

    const messageData = await MessagesModel.findById(createdMessage._id)
      .populate("sender", "id email, firstName, lastName, image, color")
      .populate("recipient", "id email, firstName, lastName, image, color");

      if(recipientSocketId){
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }

      if(senderSocketId){
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await MessagesModel.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
      timestamp: Date.now(),
      channelId,
    });
    const messageData = await MessagesModel.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec()
    await ChannelModel.findByIdAndUpdate(channelId, { $push: { messages: createdMessage._id } })

    const channel = await ChannelModel.findById(channelId).populate("members")
    const finalData = {
      ...messageData._doc, channelId: channel._id
    }

    if(channel && channel.members){
      channel.members.forEach(member => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if(memberSocketId){
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      })
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        if(adminSocketId){
          io.to(adminSocketId).emit("receiveChannelMessage", finalData);
        }
    }
  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log("connected: user " + userId + " with socket " + socket.id);
    } else {
      console.log("not connected USER Id not found");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = { setupSocket };
