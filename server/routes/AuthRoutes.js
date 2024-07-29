const authRoutes = require("express").Router();
const {
  signUp,
  login,
  getUserInfo,
  updateProfile
} = require("../controllers/AuthController.js");
const { verifyToken } = require("../middlewares/AuthMiddleware");

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);

module.exports = authRoutes;
