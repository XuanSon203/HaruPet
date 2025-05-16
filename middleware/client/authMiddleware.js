const systemConfig = require("../../config/system");
const User = require("../../model/UserModel");
module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if (!tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({
      tokenUser: tokenUser,
    }).select("-password");
    if (!user) {
      res.redirect(`/user/login`);
      return;
    }
    res.locals.user = user;
    next();
  }
};
