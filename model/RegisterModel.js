// models/RegisterModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerSchema = new Schema(
  {
    service_id: { type: String, ref: "services", required: true },
    user_id: { type: String, ref: "users", required: true },
    name: String,
    phone: String,
    date: Date,
    hours: String,
    note: String,
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("registers", registerSchema);
