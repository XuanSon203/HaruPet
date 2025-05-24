const express = require("express");
const routes = express.Router();
const checkoutController = require("../../controller/client/CheckoutController");
routes.get("/", checkoutController.index);

routes.post('/:id/:quantity', checkoutController.buyNow);

routes.post("/order", checkoutController.orderPost);
routes.get("/success/:orderId", checkoutController.success);
routes.get('/orders', checkoutController.orderList);
routes.delete("/delete/:id",checkoutController.delete)
module.exports = routes;
