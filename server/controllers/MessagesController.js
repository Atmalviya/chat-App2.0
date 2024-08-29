const Messages = require("../models/MessagesModel");
const  { mkdirSync, renameSync } = require("fs");

const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: "Both user IDs are required",
      });
    }

    const messages = await Messages.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const uploadFile = async (req, res) => {
  try {
    if(!req.file){
      return res.status(400).json({success: false, message: "file is required"})
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}/`; 
    let fileName = `${fileDir}${req.file.originalname}`; 
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      filePath : fileName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

module.exports = { getMessages, uploadFile };
