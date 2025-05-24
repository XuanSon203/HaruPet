const User = require("../../model/UserModel");
const md5 = require("md5");
const ForgotPassword = require("../../model/Forgot-PasswordModel");
const sendMailHelper = require("../../helper/send-email");
const generateHelper = require("../../helper/generate");
const MAX_LOGIN_ATTEMPTS = 5;

module.exports.register = async (req, res) => {
  try {
    res.render("client/pages/user/register");
  } catch (error) {}
};
module.exports.registerPost = async (req, res) => {
  try {
    const email = req.body.email;
    const exitsEmail = await User.findOne({
      email: email,
      deleted: false,
    });
    if (exitsEmail) {
      req.flash("error", "Email đã tồn tại ");
      return res.redirect("/user/register");
    }
    req.body.password = md5(req.body.password);

    const newUser = new User(req.body);
    newUser.save();
    res.cookie("tokenUser", newUser.tokenUser);
    return res.redirect("/user/login");
  } catch (error) {
    console.log(error);
  }
};
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login");
};
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      req.flash("error", "Email không tồn tại");
      return res.redirect("/user/login");
    }

    // Nếu tài khoản đã bị khóa
    if (user.status === "inactive") {
      req.flash(
        "error",
        "Tài khoản này đang bị khóa. Vui lòng liên hệ admin để mở tài khoản :) "
      );
      return res.redirect("/user/login");
    }

    // Kiểm tra mật khẩu
    if (password !== user.password) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = "inactive"; // khóa tài khoản
        user.loginAttempts = MAX_LOGIN_ATTEMPTS; // đảm bảo không vượt quá
        await user.save();
        req.flash(
          "error",
          "Bạn đã nhập sai quá nhiều lần. Tài khoản đã bị khóa."
        );
        return res.redirect("/user/login");
      }

      await user.save();
      req.flash(
        "error",
        `Sai mật khẩu (${user.loginAttempts}/${MAX_LOGIN_ATTEMPTS})`
      );
      return res.redirect("/user/login");
    }

    // Đăng nhập đúng
    if (user.status === "inactive") {
      user.status = "active";
      user.loginAttempts = 0; // reset số lần sai khi mở lại tài khoản
    } else {
      // Trường hợp status = active thì reset luôn loginAttempts về 0
      user.loginAttempts = 0;
    }

    await user.save();

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/user/login");
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password");
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  const loginAttempts = user.loginAttempts;
  if (!user) {
    req.flash("error", "Email không tồn tại ");
    res.redirect("back");
    return;
  } else if (loginAttempts === loginAttempts) {
    req.flash(
      "error",
      "Tài khoản của bạn đã bị khóa !. Vui lòng liên hệ với Admin ở trang Help :) "
    );
    res.redirect("/user/forgot-password");
  }
  //1. ! Tạo mã OTP và lưu OTP, thông tin yêu cầu gửi về email  vào collecttion
  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // 2. Gửi mã OTP qua email của user
  const subject = "Mã OTP lấy lại mật khẩu ";
  const html = `
    Mã OTP lấy lại mật khẩu là <b>${otp}</b>.Thời hạn sử dụng là 3 phút . Không chia sẻ mã này cho bất kì ai 
  `;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/forgot-password/otp?email=${email}`);
};
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    email,
  });
};
module.exports.otpPasswordPost = async (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "Otp không đúng  ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password");
};
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password);
  const tokenUser = req.cookies.tokenUser;
  console.log(tokenUser);
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: password,
    }
  );
  req.flash("success", "Đổi mật khẩu thành công ");
  res.redirect("/user/login");
};
