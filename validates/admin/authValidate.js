module.exports.login = (req, res, next) => {
  // Kiểm tra nếu không có tiêu đề
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email ");
    return res.redirect("back");
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng không để trống password.");
    return res.redirect("back");
  }

  next();
};
