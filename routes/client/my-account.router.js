const exprees = require("express");
const routes = exprees.Router();
const myAccountController = require("../../controller/client/MyAccountController");
const uploadCloudMiddleware = require("../../middleware/admin/uploadCloudMiddleware");
const multer = require("multer");
const upload = multer();

routes.get("/", myAccountController.index);
routes.get("/edit/:id", myAccountController.edit);
routes.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloudMiddleware.upload,
    myAccountController.editPatch
    );
module.exports = routes;
