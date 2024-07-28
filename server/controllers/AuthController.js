const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password is required");
    }
    const user = await User.create({ email, password });
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
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal serval error");
  }
};

module.exports = { signUp };