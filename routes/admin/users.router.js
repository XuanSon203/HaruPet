const express = require("express");
const routes = express.Router();
const userController = require("../../controller/admin/UserCotroller");

routes.get("/", userController.index);
routes.patch("/change-status/:status/:id", userController.changeStatus);
routes.delete("/delete/:id",userController.delete)
module.exports = routes;
