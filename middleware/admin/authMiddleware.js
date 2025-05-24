const systemConfig = require("../../config/system");
const Account = require("../../model/AccountModel");
const Role = require('../../model/RoleModel');
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({
      token: token,
    }).select("-password");
    if (!user) {
      res.redirect(`/admin/auth/login`);
    } else {
      const role = await Role.findOne({
        _id:user.role_id
      }).select("title permissions")
      res.locals.user = user; 
      res.locals.role = role
      next();
    }
    
  }
};
