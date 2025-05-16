const express = require("express");
const routes = express.Router();
const petController = require("../../controller/client/PetController");
const authMiddleware = require("../../middleware/client/authMiddleware");

routes.get("/", petController.index);
routes.get("/:slug",authMiddleware.requireAuth,petController.detail)
module.exports = routes;
