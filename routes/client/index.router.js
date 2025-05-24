const homeRouter = require("./home.router");
const petRouter = require("./pet.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const servicesRouter = require('./services.router');
const registerRouter= require("./register.router");
const myAccountRouter = require('./my-account.router');
const userMiddleware = require("../../middleware/client/useInfoMiddleware");
const cartMiddleware = require("../../middleware/client/cartMiddleware");
const authMiddleware =require('../../middleware/client/authMiddleware');
module.exports = (app) => {
  app.use(userMiddleware.infoUser);
  app.use("/", homeRouter);
  app.use("/pets", petRouter);
  app.use("/user", userRouter);
  app.use("/cart", cartMiddleware.cartId, cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/services", servicesRouter);
  app.use("/register",registerRouter)
  app.use("/my-account",authMiddleware.requireAuth,myAccountRouter)
};
