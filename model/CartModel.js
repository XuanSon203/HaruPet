const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user_id:String,
  products:[
    {
      product_id:String,
      quantity:Number
    }
  ],

},{
  timestamps:true
});

// Đặt tên collection là 'products'
const Cart = mongoose.model("carts", cartSchema, "carts");

module.exports = Cart;
