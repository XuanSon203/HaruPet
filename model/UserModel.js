const mongoose = require("mongoose");
const generate = require("../helper/generate");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String },
    email: String,
    password: String,
    address: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: {
          type: String,
          default: Date.now,
        },
      },
    ],
    loginAttempts: { type: Number, default: 0 },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema, "users");

module.exports = User;
