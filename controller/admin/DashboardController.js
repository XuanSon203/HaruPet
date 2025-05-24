const User = require("../../model/UserModel");
const Order = require("../../model/OrderModel");
const Pet = require("../../model/PetModel");

module.exports.index = async (req, res) => {
  try {
    const users = await User.countDocuments({});
    const userActive = await User.countDocuments({ status:"active" });
    const userInactive = await User.countDocuments({ status:"inactive" });
    const orders = await Order.countDocuments({});
    console.log(orders);
    const orderCompleted = await Order.countDocuments({ status: "completed" });
    const orderPending = await Order.countDocuments({ status: "pending" });
    const orderShipping = await Order.countDocuments({ status: "shipping" });
    const products = await Pet.countDocuments({});
    
    const productsActive = await Pet.countDocuments({ status: "active" });
    const productsInactive = await Pet.countDocuments({ status: "inactive" });

    res.render("admin/pages/dashboard/index.pug", {
      users,
      userActive: Number(userActive) || 0,
      userInactive: Number(userInactive) || 0,
      orders,
      orderCompleted,
      orderPending,
      orderShipping,
      products,
      productsInactive,
      productsActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
