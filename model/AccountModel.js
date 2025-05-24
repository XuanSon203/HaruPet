const mongoose = require("mongoose");
const generate = require("../helper/generate");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    fullName: { type: String },
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: String,
        default: Date.now,
      },
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
    phone: String,
    avatar: String,
    position: Number,
    role_id: String,
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Account = mongoose.model("accounts", accountSchema, "accounts");

module.exports = Account;
