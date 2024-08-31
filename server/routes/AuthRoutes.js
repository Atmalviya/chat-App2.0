const authRoutes = require("express").Router();
const {
  signUp,
  login,
  getUserInfo,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
  Logout
} = require("../controllers/AuthController.js");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const multer = require("multer");

const upload = multer({ 
  storage: multer.diskStorage({}),
});

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/update-profile-image", verifyToken, upload.single("profileImage"), updateProfileImage);
authRoutes.post("/remove-profile-image", verifyToken,  removeProfileImage);
authRoutes.get("/logout",  Logout);


module.exports = authRoutes;
