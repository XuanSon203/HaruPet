const Cart = require("../../model/CartModel");
const User = require("../../model/UserModel");

module.exports.cartId = async (req, res, next) => {
  try {
    const tokenUser = req.cookies.tokenUser;

    if (!tokenUser) {
      req.flash("error", "Bạn chưa đăng nhập.");
      return res.redirect("/user/login");
    }

    const user = await User.findOne({ tokenUser: tokenUser });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    let cart = await Cart.findOne({ user_id: user._id });

    if (!cart) {
      cart = new Cart({
        user_id: user._id,
        products: [],
      });
      await cart.save();
      
    }
    req.user = user;
    req.cart = cart;
    next();
  } catch (error) {
    console.log("Lỗi middleware cartId:", error);
    res.status(500).json({ message: "Lỗi server khi kiểm tra giỏ hàng." });
  }
};
