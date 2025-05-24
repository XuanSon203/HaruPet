const express = require("express");
const routes = express.Router();
const homeController = require("../../controller/client/HomeController");
routes.get("/", homeController.index);
routes.get("/about", homeController.about);
routes.get("/service",homeController.service)
module.exports = routes;
