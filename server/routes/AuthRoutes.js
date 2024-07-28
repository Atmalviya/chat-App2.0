const authRoutes = require("express").Router();
const authController = require("../controllers/AuthController.js");

authRoutes.post("/signup", authController.signUp);


module.exports = authRoutes;