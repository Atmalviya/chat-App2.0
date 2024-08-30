const User = require("../models/UserModel");
const Channel = require("../models/ChannelModel");
const mongoose = require("mongoose");

const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const validMemeber = await User.find({ _id: { $in: members } });
    if (validMemeber.length !== members.length) {
      return res.status(400).json({ message: "Invalid member(s)" });
    }

    const newChannel = await Channel.create({
      name,
      members,
      admin: admin._id,
    });

    await newChannel.save();
    return res
      .status(201)
      .json({ message: "Channel created successfully", newChannel });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ members: userId }, { admin: userId }],
    }).sort({ updatedAt: -1 });
    
  
    return res.status(200).json({ success: true, channels });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createChannel, getUsersChannels };
