const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    title: { type: String, required: true },
    permissions: { type: Array, default: [] },
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    description: String,
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Role = mongoose.model("roles", roleSchema, "roles");

module.exports = Role;
