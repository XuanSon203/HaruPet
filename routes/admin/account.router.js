const express = require("express");
const routes = express.Router();
const accountController = require("../../controller/admin/AccountController");
const multer = require("multer");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();
routes.get("/", accountController.index);
routes.get("/create", accountController.create);
routes.post(
  "/create",
  upload.single("avatar"),
  uploadCloudMiddleware.upload,
  accountController.createPost
);
routes.get("/edit/:id", accountController.edit);
routes.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloudMiddleware.upload,
  accountController.editPatch
);
routes.patch("/change-status/:status/:id", accountController.changeStatus);
routes.patch("/change-multi", accountController.changeMulti),
routes.delete("/delete/:id", accountController.delete);
module.exports = routes;
