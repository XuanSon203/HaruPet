const Role = require("../../model/RoleModel");
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

    const countProducts = await Role.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const roles = await Role.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    res.render("admin/pages/roles/index", {
      roles,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create");
};
module.exports.createPost = async (req, res) => {
  try {
    const newRole = new Role(req.body);
    newRole.save();
    req.flash("success", " Tạo thành công ");
    res.redirect("/admin/roles");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi. Vui lòng thử lại sau :)");
    console.log(error);
    res.redirect("/admin/roles");
  }
};
// Get Edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", { data });
  } catch (error) {
    res.redirect("/admin/roles/index");
  }
};
// Get Create
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    res.redirect("/admin/roles");
  } catch (error) {
    res.redirect("/admin/roles");
  }
};
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true });
    res.redirect("/admin/roles");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/roles");
  }
};
// PATCH: Thay đổi trạng thái 1 hoặc nhiều sản phẩm qua checkbox
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids.split(",");
    const type = req.body.type;

    switch (type) {
      case "active":
        await Role.updateMany({ _id: { $in: ids } }, { status: "active" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} quyền  thành Active`
        );
        break;

      case "inactive":
        await Role.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} quyền  thành Inactive`
        );
        break;

      case "deleteAll":
        await Role.updateMany(
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
          await Role.updateOne({ _id: id }, { position: position });
        }
        req.flash(
          "success",
          `Thay đổi thành công vị trí của ${ids.length} sản phẩm`
        );
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("/admin/roles");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await Role.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", `Cật nhật trạng thái danh mục thành công `);
    res.redirect("/admin/roles");
  } catch (error) {
    console.log(error);
      req.flash("error", `Cật nhật trạng thái danh mục thất bại  `);
    res.redirect("/admin/roles");
  }
};
// Get Permissiom
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", { records });
};
// Patch Permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    const id = item.id;
    const permissions = item.permissions;
    await Role.updateOne({ _id: id }, { permissions: permissions });
  }
  req.flash('success',"Cật nhập phân quyền thành công ")
  res.redirect('/admin/roles/permissions');
};
