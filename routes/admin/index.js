const dashboardRouter = require("./dashboard.router");
const petRouter = require("./pet.router");
const breedPetRouter = require("./breedpet.router");
const accountRouter = require("./account.router");
const roleRouter = require("./roles.router");
const authRouter = require("./auth.router");
const orderRouter = require("./order.router");
const userRouter = require('./users.router');
const serviceRouter = require('./service.router');
const authMiddleware = require("../../middleware/admin/authMiddleware");
const systemConfig = require("../../config/system");


module.exports = (app) => {
  const admin = systemConfig.prefixAdmin;
  app.use(`${admin}/auth`, authRouter);
  app.use(admin, authMiddleware.requireAuth, dashboardRouter);
  app.use(`${admin}/pets`, authMiddleware.requireAuth, petRouter);
  app.use(`${admin}/breeds`, authMiddleware.requireAuth, breedPetRouter);
  app.use(`${admin}/accounts`, authMiddleware.requireAuth, accountRouter);
  app.use(`${admin}/roles`, authMiddleware.requireAuth, roleRouter);
  app.use(`${admin}/orders`, authMiddleware.requireAuth, orderRouter);
  app.use(`${admin}/users`, authMiddleware.requireAuth, userRouter);
  app.use(`${admin}/services`, authMiddleware.requireAuth, serviceRouter);
};
