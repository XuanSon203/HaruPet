const Register = require("../../model/RegisterModel");
const User = require("../../model/UserModel");
const Service = require("../../model/ServiceModel");
module.exports.index = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;

    const user = await User.findOne({ tokenUser });
    if (!user) {
      req.flash("error", "Không thể đăng ký khi chưa đăng nhập ");
      return res.redirect("/");
    }

    const registers = await Register.find({ user_id: user._id });

    const fullRegisters = await Promise.all(
      registers.map(async (reg) => {
        const service = await Service.findById(reg.service_id);
        return {
          ...reg._doc,
          service,
        };
      })
    );

    res.render("client/pages/registers/index", {
      registers: fullRegisters,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Đã xảy ra lỗi.");
    res.redirect("/");
  }
};

module.exports.register = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser || "";
    const user = await User.findOne({ tokenUser });
    if (!user) {
      req.flash("error", "Bạn cần đăng nhập trước khi đăng ký dịch vụ.");
      return res.redirect("/login");
    }

    const slug = req.params.slug;
    const service = await Service.findOne({ slug, deleted: false });
    if (!service) {
      req.flash("error", "Dịch vụ không tồn tại.");
      return res.redirect("/services");
    }
    await Register.create({
      service_id: service._id,
      user_id: user._id,
      name: req.body.name,
      phone: req.body.phone || user.phone,
      date: req.body.date,
      hours: req.body.hours,
      note: req.body.note,
    });

    req.flash("success", "Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.");
    res.redirect(`/services/${slug}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại.");
    res.redirect("");
  }
};

module.exports.cancel = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await Register.updateOne(
      {
        _id: id,
      },
      {
        status: "cancelled",
      }
    );
    res.redirect("/register");
  } catch (error) {}
};
