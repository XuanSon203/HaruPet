const express = require("express");
const routes = express.Router();
const breedController = require("../../controller/admin/BreedPetController");
const multer = require("multer");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();
routes.get("/", breedController.index);
routes.get("/create", breedController.create);
routes.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  breedController.createPost
);
routes.get("/:id", breedController.detail);
routes.get("/edit/:id", breedController.edit);
routes.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudMiddleware.upload,
  breedController.editPatch
);
routes.delete("/delete/:id",breedController.delete)
routes.patch("/change-multi", breedController.changeMulti),
routes.patch("/change-status/:status/:id", breedController.changeStatus);
module.exports = routes;
