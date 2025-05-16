const Account = require("../../model/AccountModel");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const Role = require("../../model/RoleModel");
const md5 = require("md5");
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.$or = [
        { fullName: objectSearch.regex },
        { email: objectSearch.regex },
      ];
    }
    const countProducts = await Account.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const accounts = await Account.find(find)
      .select("-password -token")
      .sort({
        position: "desc",
      })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    //   Lấy ra thông tin người tạo
    for (let account of accounts) {
      const user = await Account.findOne({
        _id: account.createdBy.account_id,
      });
      if (user) {
        account.accountFullName = user.fullName;
      }
      const updatedBy = account.updatedBy[account.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
    for (const item of accounts) {
      const role = await Role.findOne({
        _id: item.role_id,
        deleted: false,
      });
      item.role = role;
    }
    res.render("admin/pages/accounts/index.pug", {
      accounts,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.create = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/create", { roles });
  } catch (error) {
    console.log(error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!req.body.position) {
      const countProducts = await Account.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    // Kiểm tra mật khẩu trước khi mã hóa
    if (!password || password.length < 6) {
      req.flash("error", "Mật khẩu phải có độ dài lớn hơn 6 ký tự");
      return res.redirect("/admin/accounts/create");
    }

    const existingEmail = await Account.findOne({ email: email });

    if (existingEmail) {
      req.flash("error", "Email này đã tồn tại");
      return res.redirect("/admin/accounts/create");
    }

    const newAccount = new Account({
      ...req.body,
      password: md5(password),
    });

    await newAccount.save();

    req.flash("success", "Tạo tài khoản thành công");
    res.redirect("/admin/accounts");
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tạo tài khoản");
    res.redirect("/admin/accounts/create");
  }
};
// GET:(/edit/:id) lấy ra thon tin sản phẩm dựa vào id và chuyển hướng tới trang edit
module.exports.edit = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false });
    const id = req.params.id;
    const data = await Account.findOne({
      _id: id,
    });

    res.render("admin/pages/accounts/edit.pug", { data, roles });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/accounts`);
  }
};
// Patch
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    // Kiểm tra email đã tồn tại hay  chưa
    const emailExist = await Account.findOne({
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
      await Account.updateOne(
        { _id: id },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", "Cật nhập tài khoản thành công ");
      res.redirect("/admin/accounts");
    }
  } catch (error) {
    console.log(error);
  }
};

// DELETE:(delete/:id) Xóa sản phẩm theo id gửi lên từ form
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { deleted: true, status: "inactive" });
    req.flash("success", "Đã vô hiệu hóa tài khoản !");
    res.redirect("/admin/accounts");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect("/admin/accounts");
  }
};
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Account.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );

  res.redirect("/admin/accounts");
};
// PATCH: Thay đổi trạng thái 1 hoặc nhiều sản phẩm qua checkbox
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids.split(",");
    const type = req.body.type;

    switch (type) {
      case "active":
        await Account.updateMany({ _id: { $in: ids } }, { status: "active" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Active`
        );
        break;

      case "inactive":
        await Account.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Inactive`
        );
        break;

      case "deleteAll":
        await Account.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
        break;

      case "change-position":
        for (const item of ids) {
          let [id, position] = item.split("-");
          id = id.trim();
          position = parseInt(position);
          await Account.updateOne({ _id: id }, { position: position });
        }
        req.flash(
          "success",
          `Thay đổi thành công vị trí của ${ids.length} sản phẩm`
        );
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("/admin/accounts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
