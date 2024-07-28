const uri = process.env.MONGO_URI;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(uri)
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    return console.error(err.message);
  }
};

module.exports = connectDB;
