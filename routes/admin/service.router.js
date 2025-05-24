const express = require("express");
const routes = express.Router();
const serviceController = require("../../controller/admin/ServiceController");
const multer = require("multer");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();

routes.get("/", serviceController.index);
routes.get("/create", serviceController.create);
routes.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  serviceController.createPost
);
routes.get("/edit/:id", serviceController.edit);
routes.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  serviceController.editPatch
);
routes.delete("/delete/:id", serviceController.delete);
routes.patch("/change-multi", serviceController.changeMulti),
  routes.patch("/change-status/:status/:id", serviceController.changeStatus);
module.exports = routes;
