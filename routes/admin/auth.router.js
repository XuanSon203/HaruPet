const express = require("express");
const routes = express.Router();
const authController = require("../../controller/admin/AuthController");
const validate = require("../../validates/admin/authValidate");
routes.get("/login", authController.login);
routes.post("/login", validate.login, authController.loginPost);
routes.get("/logout", authController.logout);
module.exports = routes;
