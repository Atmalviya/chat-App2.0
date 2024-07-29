const authRoutes = require("express").Router();
const {
  signUp,
  login,
  getUserInfo,
  updateProfile,
  updateProfileImage,
  removeProfileImage
} = require("../controllers/AuthController.js");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/update-profile-image", verifyToken, upload.single("profileImage"), updateProfileImage);
authRoutes.post("/remove-profile-image", verifyToken,  removeProfileImage);


module.exports = authRoutes;
