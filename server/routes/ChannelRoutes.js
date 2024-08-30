const channelRoutes = require("express").Router();

const { verifyToken } = require("../middlewares/AuthMiddleware");
const { createChannel, getUsersChannels } = require("../controllers/ChannelController");

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channel", verifyToken, getUsersChannels);

module.exports = channelRoutes