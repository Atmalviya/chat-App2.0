const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) return res.status(403).json({ message: "token is not valid" });
      req.userId = payload.userId;
      next();
    });
  }
};

module.exports = { verifyToken };
