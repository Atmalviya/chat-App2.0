const Router = require("express");
const { SearchedContacts } = require("../controllers/ContactController");
const { verifyToken } = require("../middlewares/AuthMiddleware");

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, SearchedContacts);

module.exports = contactsRoutes