const express = require("express");
const routes = express.Router();
const userController = require("../../controller/client/UserController");
const validate = require("../../validates/client/userValidate");
const loginValidate = require("../../validates/client/userValidate");
routes.get("/register", userController.register);
routes.post(
  "/register",
  validate.register,
  userController.registerPost
);
routes.get("/login", userController.login);
routes.post("/login", loginValidate.login, userController.loginPost);
routes.get("/logout", userController.logout);
routes.get("/forgot-password",userController.forgotPassword);
routes.post("/forgot-password",validate.forgotPassword,userController.forgotPasswordPost);
routes.get("/forgot-password/otp",userController.otpPassword)
routes.post("/forgot-password/otp",userController.otpPasswordPost)
routes.get("/password/reset",userController.resetPassword)
routes.post("/password/reset",validate.resetPassword,userController.resetPasswordPost)
module.exports = routes;
