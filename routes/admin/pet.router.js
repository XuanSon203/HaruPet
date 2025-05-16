const express = require("express");
const routes = express.Router();
const petController = require("../../controller/admin/PetController");
const petValidate = require("../../validates/admin/PetVaidate");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const multer = require("multer");
const upload = multer();

routes.get("/", petController.index);
routes.get("/create", petController.create);
routes.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  petValidate.createPost,
  petController.createPost
);
routes.get("/bin", petController.bin);
routes.delete("/bin/delete/:id", petController.binDelete);
routes.patch("/bin/reset/:id", petController.reset);
routes.get("/:id", petController.detail);
routes.get("/edit/:id", petController.edit);
routes.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  petController.editPatch
);
routes.delete("/delete/:id", petController.delete);
routes.patch("/change-multi", petController.changeMulti),
routes.patch("/change-status/:status/:id", petController.changeStatus);
module.exports = routes;
