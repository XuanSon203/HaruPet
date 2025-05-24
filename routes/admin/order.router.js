const express = require("express");
const routes = express.Router();
const orderController = require("../../controller/admin/OrderController");
routes.get("/", orderController.orderList);
routes.get("/edit/:id", orderController.editOrder);
routes.patch("/edit/:id", orderController.editOrderPatch);
module.exports = routes;
