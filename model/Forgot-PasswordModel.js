const mongoose = require("mongoose");
const generate = require("../helper/generate");
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 180,
    },
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const ForgotPassword = mongoose.model(
  "forgot-password",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
