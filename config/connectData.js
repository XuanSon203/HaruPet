const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_STRING, {

    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error.message);
  }
};
