const Router = require("express");
const { SearchedContacts, getContactsForDmList } = require("../controllers/ContactController");
const { verifyToken } = require("../middlewares/AuthMiddleware");

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, SearchedContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDmList);

module.exports = contactsRoutes