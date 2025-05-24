const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    status: {
      type: String,
      enum: ["pending", "shipping", "completed"],
      default: "pending",
    },
    products: [
      {
        product_id: String,
        quantity: Number,
        discount: Number,
        price: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("orders", orderSchema, "orders");

module.exports = Order;
