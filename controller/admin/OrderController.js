const Order = require("../../model/OrderModel");
const Pet = require("../../model/PetModel");
const Account = require("../../model/AccountModel");
const paginationHelper = require("../../helper/pagination");

module.exports.orderList = async (req, res) => {
  try {
    let find ={

    }
    const token = req.cookies.token;
    const account = await Account.findOne({ token });

    if (!account) {
      req.flash("error","Bạn chưa đăng nhập !")
      return res.redirect("/admim/auth/login");
    }

    const countProducts = await Order.countDocuments(find);

    // Phân trang
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 2,
      },
      req.query,
      countProducts
    );
    // Lấy tất cả đơn hàng và thông tin user đặt hàng
    const orders = await Order.find()
      .sort({ _id: -1 })
      .populate("user_id", "fullName phone address")
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

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

    res.render("admin/pages/orders/index", {
      orders,
      pagination:objectPagination
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).send("Lỗi lấy danh sách đơn hàng");
  }
};
module.exports.editOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin đơn hàng theo ID và populate người đặt
    const order = await Order.findById(id).populate(
      "user_id",
      "fullName phone address"
    );

    if (!order) {
      return res.status(404).send("Không tìm thấy đơn hàng");
    }

    // Lấy thông tin chi tiết sản phẩm cho đơn hàng
    for (let product of order.products) {
      const productInfo = await Pet.findById(product.product_id).select(
        "name thumbnail"
      );
      product.productInfo = productInfo;
      product.priceNew = product.price * 0.8;
      product.totalPrice = product.priceNew * product.quantity;
    }

    // Tính tổng tiền
    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.render("admin/pages/orders/edit", {
      order,
    });
  } catch (err) {
    console.error("Lỗi hiển thị chỉnh sửa đơn hàng:", err);
    res.status(500).send("Lỗi hiển thị chỉnh sửa đơn hàng");
  }
};
module.exports.editOrderPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).send("Không tìm thấy đơn hàng để cập nhật");
    }

    res.redirect("/admin/orders"); // hoặc tên route danh sách đơn hàng của bạn
  } catch (err) {
    console.error("Lỗi cập nhật đơn hàng:", err);
    res.status(500).send("Lỗi cập nhật đơn hàng");
  }
};
