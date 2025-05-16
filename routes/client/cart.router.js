const express = require("express");
const routes = express.Router();
const cartController = require("../../controller/client/CartController");
routes.get("/", cartController.index);
routes.post("/add/:productId/:quantity", cartController.addCart);
routes.patch("/update/:productId/:quantity",cartController.updateQuantity);
routes.delete("/delete/:productId",cartController.deleteItem)
module.exports = routes;
