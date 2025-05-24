module.exports.register = (req, res, next) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || fullName.trim() === "") {
    req.flash("error", "Vui lòng không để trống họ tên.");
    return res.redirect("/user/register");
  }

  if (!email || email.trim() === "") {
    req.flash("error", "Vui lòng nhập Email.");
    return res.redirect("/user/register");
  }

  if (!phone || phone.trim() === "") {
    req.flash("error", "Vui lòng nhập số điện thoại.");
    return res.redirect("/user/register");
  }

  if (!password || password.trim() === "") {
    req.flash("error", "Vui lòng không để trống mật khẩu.");
    return res.redirect("/user/register");
  }

  if (password.length < 6 || password.length > 12) {
    req.flash("error", "Mật khẩu phải có độ dài từ 6 đến 12 ký tự.");
    return res.redirect("/user/register");
  }

  next();
};

module.exports.login = (req, res, next) => {
  const { email, phone, password } = req.body;
  if (!email || email.trim() === "") {
    req.flash("error", "Vui lòng nhập Email.");
    return res.redirect("/user/login");
  }

  if (!password || password.trim() === "") {
    req.flash("error", "Vui lòng không để trống mật khẩu.");
    return res.redirect("/user/login");
  }

  next();
};
module.exports.forgotPassword = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Email không để trống.");
    return res.redirect("back");
  }
 
  next();
};
module.exports.resetPassword = (req, res, next) => {

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu mới .");
    return res.redirect("back");
  }
  if (!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xác nhận lại.");
    return res.redirect("back");
  }
  if (req.body.confirmPassword != req.body.password) {
    req.flash("error", "Mật khẩu không trùng khớp.");
    return res.redirect("back");
  }
 
  next();
};
