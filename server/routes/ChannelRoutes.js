const channelRoutes = require("express").Router();

const { verifyToken } = require("../middlewares/AuthMiddleware");
const { createChannel, getUsersChannels, getChannelMessages } = require("../controllers/ChannelController");

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channel", verifyToken, getUsersChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

module.exports = channelRoutes; 