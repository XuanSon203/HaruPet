const Cart = require("../../model/CartModel");
const Pet = require("../../model/PetModel");
const User = require("../../model/UserModel");

module.exports.index = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (cart && cart.products.length > 0) {
      let totalCartPrice = 0;

      for (let item of cart.products) {
        const productId = item.product_id;
        const productInfo = await Pet.findOne({ _id: productId });

        if (productInfo) {
          productInfo.priceNew = productInfo.price * 0.8;
          item.productInfo = productInfo;
          item.totalPrice = item.quantity * productInfo.priceNew;
          totalCartPrice += item.totalPrice;
        }
      }

      cart.totalPrice = totalCartPrice;
    }

    res.render("client/pages/cart/index.pug", {
      cart,
    });
  } catch (error) {
    console.log("Lỗi hiển thị giỏ hàng:", error);
    res.redirect("/");
  }
};
module.exports.addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.params;
    const cart = await Cart.findOne({ user_id: req.user._id });

    const existingProduct = cart.products.find(
      (p) => p.product_id == productId
    );
    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
    } else {
      cart.products.push({
        product_id: productId,
        quantity: parseInt(quantity),
      });
    }
    await cart.save();
    req.flash("success", "Đã thêm vào giỏ hàng");
    res.redirect("/cart");
  } catch (err) {
    console.log("Lỗi thêm giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.updateQuantity = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);

    const user = await User.findOne({ tokenUser: tokenUser });
    if (!user) return res.status(404).send("User not found");

    await Cart.updateOne(
      { user_id: user._id, "products.product_id": productId },
      { $set: { "products.$.quantity": quantity } }
    );
    res.redirect("/cart");
  } catch (error) {
    console.error("Update Quantity Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports.deleteItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser: tokenUser });
    if (!user) return res.status(404).send("User not found");
    await Cart.updateOne(
      { user_id: user._id },
      { $pull: { products: { product_id: productId } } }
    );
    req.flash("success", "Sản phẩm đã được xóa khỏi giỏ hàng ");
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};
