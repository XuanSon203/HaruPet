const express = require("express");
const routes = express.Router();
const registerController = require("../../controller/client/RegisterController");

routes.get("/", registerController.index);
routes.post("/service/:slug", registerController.register);
routes.patch("/cancel/:id", registerController.cancel);
module.exports = routes;
