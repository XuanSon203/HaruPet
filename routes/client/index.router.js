const homeRouter = require("./home.router");
const petRouter = require("./pet.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const checkoutRouter = require("./checkout.router");
const userMiddleware = require("../../middleware/client/useInfoMiddleware");
const cartMiddleware = require("../../middleware/client/cartMiddleware");
module.exports = (app) => {
  app.use(userMiddleware.infoUser);
  app.use("/", homeRouter);
  app.use("/pets", petRouter);
  app.use("/user", userRouter);
  app.use("/cart", cartMiddleware.cartId, cartRouter);
  app.use("/checkout", checkoutRouter);
};
