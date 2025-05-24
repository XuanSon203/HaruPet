const Services = require("../../model/ServiceModel");
const Account = require("../../model/AccountModel");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    // Tìm kiếm sản phẩm dùng regex
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    const countProducts = await Services.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const services = await Services.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    //   Lấy ra thông tin người tạo
    for (let item of services) {
      const user = await Account.findOne({
        _id: item.createdBy.account_id,
      });
      if (user) {
        item.accountFullName = user.fullName;
      }
      const updatedBy = item.updatedBy[item.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
    res.render("admin/pages/services/index", {
      services,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/services/create");
};
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position) {
      const countProducts = await Services.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const newService = await Services(req.body);
    newService.save();
    req.flash("success", "Thêm dịch vụ thành công ");
    res.redirect("/admin/services");
  } catch (error) {
    console.log(error);
  }
};
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Services.findOne({
      _id: id,
    });
    res.render("admin/pages/services/edit", { service });
  } catch (error) {
    console.log(error);
  }
};
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date(),
    };
    await Services.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cật nhập thành công ");
    res.redirect("/admin/services");
  } catch (error) {
    req.flash("error", "Cật nhập thành công ");
    console.log(error);
    res.redirect("/admin/services");
  }
};
// DELETE:(delete/:id) Xóa sản phẩm theo id gửi lên từ form
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Services.deleteOne({ _id: id });
    req.flash("success", "Xoá dịch vụ thành công ");
    res.redirect("/admin/services");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect("/admin/services");
  }
};
// PATCH: Thay đổi trạng thái 1 hoặc nhiều sản phẩm qua checkbox
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids.split(",");
    const type = req.body.type;

    switch (type) {
      case "active":
        await Services.updateMany({ _id: { $in: ids } }, { status: "active" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Active`
        );
        break;

      case "inactive":
        await Services.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Inactive`
        );
        break;

      case "deleteAll":
        await Services.updateMany(
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
          await Services.updateOne({ _id: id }, { position: position });
        }
        req.flash(
          "success",
          `Thay đổi thành công vị trí của ${ids.length} sản phẩm`
        );
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("/admin/services");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Services.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );

  res.redirect("/admin/services");
};
