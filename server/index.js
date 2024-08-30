const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/AuthRoutes.js");
const contactsRoutes = require("./routes/ContactRoutes.js");
const messageRoutes = require("./routes/MessagesRoute.js");
const channelRoutes = require("./routes/ChannelRoutes.js");
const {setupSocket} = require("./socket.js");
const app = express();
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use('/uploads/files', express.static('uploads/files'));

app.use(express.json()); 
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/contacts", contactsRoutes);
app.use("/messages", messageRoutes);
app.use('/channel', channelRoutes)


//* DB Connection
const dbConn = require("./db/dbConn");
dbConn();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

setupSocket(server);   