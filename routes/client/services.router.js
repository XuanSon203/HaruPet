const express = require("express");
const routes = express.Router();
const serviceController = require("../../controller/client/ServiceController");
const multer = require("multer");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();

routes.get("/", serviceController.index);
routes.get("/:slug", serviceController.detail);

module.exports = routes;
