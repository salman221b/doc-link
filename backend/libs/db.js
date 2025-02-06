const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};
module.exports = connectDB;
