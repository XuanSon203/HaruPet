const User = require("../../model/UserModel");
module.exports.index = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
      tokenUser: tokenUser,
    });
    res.render("client/pages/my-account/index", { user });
  } catch (error) {}
};
// GET:(/edit/:id) lấy ra thon tin sản phẩm dựa vào id và chuyển hướng tới trang edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findOne({
      _id: id,
    });
    console.log(user);
    res.render("client/pages/my-account/edit", { user });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/my-account`);
  }
};
// Patch
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    // Kiểm tra email đã tồn tại hay  chưa
    const emailExist = await User.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });
    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date(),
    };
    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại `);
      res.redirect("back");
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      await User.updateOne(
        { _id: id },

        req.body
      );
      req.flash("success", "Cật nhập tài khoản thành công ");
      res.redirect("/my-account");
    }
  } catch (error) {
    console.log(error);
  }
};
