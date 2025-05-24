const express = require("express");
const routes = express.Router();
const dashboardController = require('../../controller/admin/DashboardController');
routes.get("/",dashboardController.index);

module.exports = routes