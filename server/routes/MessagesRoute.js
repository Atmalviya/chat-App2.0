const { Router } = require("express");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const { getMessages } = require("../controllers/MessagesController");

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);

module.exports = messageRoutes;