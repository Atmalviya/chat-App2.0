const { Router } = require("express");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const { getMessages, uploadFile } = require("../controllers/MessagesController");
const multer = require("multer");

const messageRoutes = Router();
const upload = multer({ 
    storage: multer.diskStorage({}),
    limits: { fileSize: 100000000 }
 });

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post("/uploadFile", verifyToken, upload.single("file"), uploadFile);

module.exports = messageRoutes;