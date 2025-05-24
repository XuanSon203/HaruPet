const BreedPet = require("../../model/BreedPetModel");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const Account = require("../../model/AccountModel");
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

    const countProducts = await BreedPet.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const data = await BreedPet.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    //   Lấy ra thông tin người tạo
    for (let item of data) {
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
    res.render("admin/pages/breedPet/index", {
      data,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    
    const categories = await BreedPet.find(find);
    res.render("admin/pages/breedPet/create",
      { categories }
    );

  } catch (error) {
    console.log(error);
  }
};
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position) {
      const countProducts = await BreedPet.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const newBreedPet = new BreedPet(req.body);
    await newBreedPet.save();
    res.redirect("/admin/breeds");
  } catch (error) {}
};
// GET:(/:id) Lấy ra thông tin chi tiết về sản phẩm dựa vào id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await BreedPet.findOne({
      _id: id,
    });
    res.render(`admin/pages/breedPet/detail`, { data });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/breeds`);
  }
};
// GET:(/edit/:id) lấy ra thon tin sản phẩm dựa vào id và chuyển hướng tới trang edit
module.exports.edit = async (req, res) => {
  try {
     let find = {
      deleted: false,
    };
    
    const categories = await BreedPet.find(find);
    const id = req.params.id;
    const data = await BreedPet.findOne({
      _id: id,
    });
    res.render("admin/pages/breedPet/edit", { data ,categories});
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/breeds`);
  }
};
// PATCH:(edit/:id)  Nhân thông tin chỉnh sửa từ form và tiến hành cật nhập lên
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date(),
    };
    await BreedPet.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cật nhật thành công ");
    res.redirect("/admin/breeds");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/breeds`);
  }
};
// DELETE:(delete/:id) Xóa sản phẩm theo id gửi lên từ form
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await BreedPet.deleteOne({ _id: id });

    req.flash("success", "Danh mục đã được xóa  !");
    res.redirect("/admin/breeds");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect("/admin/breeds");
  }
};

// PATCH: Thay đổi trạng thái 1 hoặc nhiều sản phẩm qua checkbox
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids.split(",");
    const type = req.body.type;

    switch (type) {
      case "active":
        await BreedPet.updateMany({ _id: { $in: ids } }, { status: "active" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Active`
        );
        break;

      case "inactive":
        await BreedPet.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Inactive`
        );
        break;

      case "deleteAll":
        await BreedPet.updateMany(
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
          await BreedPet.updateOne({ _id: id }, { position: position });
        }
        req.flash(
          "success",
          `Thay đổi thành công vị trí của ${ids.length} sản phẩm`
        );
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("/admin/breeds");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await BreedPet.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", `Cật nhật trạng thái danh mục thành công `);
    res.redirect("/admin/breeds");
  } catch (error) {
    req.flash("success", `Cật nhật trạng thái danh mục thất bại `);
    res.redirect("/admin/breeds");
  }
};
