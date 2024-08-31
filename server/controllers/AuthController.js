const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { renameSync, unlinkSync } = require("fs");
const path = require("path");
const {uploadFileToCloud, deleteFileFromCloud } = require("../db/cloudinaryController");
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });
    res.cookie("token", createToken(email, user._id), {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res.cookie("token", createToken(email, user._id), {
      expiresIn: "1d",
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      message: "Login successful",
    });
  } catch (error) {}
};

const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      _id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {}
};

const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const response = await uploadFileToCloud(req.file.path);
    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: "File not uploaded" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: response.secure_url,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      image: updatedUser.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "Internal server error" });
  }
};

const removeProfileImage = async (req, res, next) => {
  const userId = req.userId;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      if (user.image) {
          const publicId = user.image.split('/').pop().split('.')[0];
          await deleteFileFromCloud(publicId);
          user.image = null;
          await user.save();
      }

      return res.status(200).json({
          message: "Profile image removed successfully",
      });
  } catch (error) {
      console.error("Error removing profile image:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};


// const removeProfileImage = async (req, res, next) => {
//   const userId = req.userId;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (user.image) {
//       unlinkSync(user.image);
//     }
//     user.image = null;
//     await user.save();

//     return res.status(200).json({
//       message: "Profile image removed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({ error, message: "Internal server error" });
//   }
// };

const Logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {maxAge: 1, expires: new Date(0), secure: true, sameSite: "None"});
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    
  }
}

module.exports = {
  signUp,
  login,
  getUserInfo,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
  Logout
};
