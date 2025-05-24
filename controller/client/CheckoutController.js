const Order = require("../../model/OrderModel");
const Pet = require("../../model/PetModel");
const Cart = require("../../model/CartModel");
const User = require("../../model/UserModel");

module.exports.buyNow = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser });
    if (!user) return res.redirect("/login");

    const productId = req.params.id;
    const qty = parseInt(req.body.qty) || 1;

    const pet = await Pet.findById(productId);
    if (!pet) return res.status(404).send("Không tìm thấy sản phẩm");

    // 👉 Kiểm tra địa chỉ
    const address = user.address;
    if (!address) {
      // Có thể dùng flash hoặc query string để báo lỗi
      req.flash("error", "Bạn đang thiếu địa chỉ ");
      return res.redirect("/pets");
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user_id: user._id,
      userInfo: {
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
      },
      products: [
        {
          product_id: pet._id,
          quantity: qty,
          price: pet.price,
          discount: 0,
        },
      ],
    });

    res.redirect(`/checkout/success/${order.id}`);
  } catch (err) {
    console.error("Lỗi Buy-Now:", err);
    res.status(500).send("Đã xảy ra lỗi khi đặt hàng.");
  }
};

module.exports.index = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
      tokenUser: tokenUser,
    });
    const cart = await Cart.findOne({
      user_id: user._id,
    });
    if (cart.products.length > 0) {
      for (let item of cart.products) {
        const productId = item.product_id;
        const productInfo = await Pet.findOne({
          _id: productId,
        });
        productInfo.priceNew = productInfo.price * (100 - 20);
        item.productInfo = productInfo;
        item.totalPrice = cart.products.reduce(
          (sum, item) => sum + item.quantity * productInfo.priceNew,
          0
        );
      }
      cart.totalPrice = cart.products.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
    }

    res.render("client/pages/checkout/index", {
      cartDetail: cart,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.orderPost = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser });

    if (!user) {
      return res.redirect("/login");
    }

    const cart = await Cart.findOne({ user_id: user._id });
    if (!cart || cart.products.length === 0) {
      return res.redirect("/cart");
    }

    const userInfo = {
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    };

    let products = [];
    for (let product of cart.products) {
      const productInfo = await Pet.findOne({ _id: product.product_id });
      if (!productInfo) continue;

      products.push({
        product_id: product.product_id,
        quantity: product.quantity,
        discount: 0,
        price: productInfo.price,
      });
    }

    const objectOrder = {
      user_id: user._id,
      cart_id: cart._id,
      userInfo: userInfo,
      products: products,
    };

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({ user_id: user._id }, { products: [] });

    res.redirect(`/checkout/success/${order.id}`);
  } catch (err) {
    console.error("Lỗi đặt hàng:", err);
    res.status(500).send("Lỗi xử lý đơn hàng");
  }
};
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  for (let product of order.products) {
    const productInfo = await Pet.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew = product.price * ((100 - 20) / 100);
    product.totalPrice = product.priceNew * product.quantity;
  }
  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/success", { order });
};
module.exports.orderList = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser });

    if (!user) {
      return res.redirect("/user/login");
    }

    const orders = await Order.find({ user_id: user._id }).sort({ _id: -1 });

    // Gắn thông tin sản phẩm cho từng đơn hàng
    for (let order of orders) {
      for (let product of order.products) {
        const productInfo = await Pet.findOne({
          _id: product.product_id,
        }).select("name thumbnail");
        product.productInfo = productInfo;
        product.priceNew = product.price * 0.8;
        product.totalPrice = product.priceNew * product.quantity;
      }
      order.totalPrice = order.products.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
    }

    res.render("client/pages/checkout/orderList", {
      orders,
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).send("Lỗi lấy danh sách đơn hàng");
  }
};
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.deleteOne({
      _id: id,
    });
    req.flash("success", "Đơn hàng đã đc hủy thành công ");
    res.redirect("/checkout/orders");
  } catch (error) {}
};
