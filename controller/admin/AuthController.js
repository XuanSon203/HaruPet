const Account = require("../../model/AccountModel");
const md5 = require("md5");
const systemConfig = require("../../config/system");
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  
  if (token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login");
  }
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại ");
    res.redirect("/admin/auth/login");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("/admin/auth/login");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa ");
    res.redirect("/admin/auth/login");
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}`);
};
module.exports.logout = async (req, res) => {
  //  Xoá token
  res.clearCookie("token");
  res.render("admin/pages/auth/login");
};
