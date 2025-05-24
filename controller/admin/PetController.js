const Pet = require("../../model/PetModel");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const BreedPet = require("../../model/BreedPetModel");
const Account = require("../../model/AccountModel");
const createTreeHelper = require("../../helper/create-tree");
// Lấy ra danh sách thú cưng
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    // Tìm kiếm sản phẩm dùng regex
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.name = objectSearch.regex;
    }

    const countProducts = await Pet.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const countProductBin = await Pet.countDocuments({
      deleted: true,
    });
    const data = await Pet.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
  //   Lấy ra thông tin người tạo 
    for (let item of data) {
      const user = await Account.findOne({
        _id: item.createdBy.account_id,
      });
      if(user){
        item.accountFullName = user.fullName;
      }
      const updatedBy = item.updatedBy[item.updatedBy.length - 1];
      if(updatedBy){
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy.accountFullName = userUpdated.fullName;
        
      }
    }
     // Lấy ra thông tin người cập nhật gần nhất
    res.render("admin/pages/pets/index.pug", {
      data,
      pagination: objectPagination,
      countProductBin,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect(`/admin/pets`);
  }
};

// GET: Chuyển hướng tới trang thêm
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const breeds = await BreedPet.find(find);
    res.render(`admin/pages/pets/create`, { breeds });
  } catch (error) {
    res.redirect(`/admin/pets`);
  }
};
// POST: Nhận dữ liệu từ form gửi lên và tiến hành cật nhậ p vào database
module.exports.createPost = async (req, res) => {
  try {
    // Nếu không nhập vị trí, tự động tăng
    if (!req.body.position) {
      const countProducts = await Pet.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const newPet = new Pet(req.body);
    await newPet.save();
    res.redirect(`/admin/pets`);
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi khi thêm thú cưng ");
    console.log(error);
    res.redirect(`/admin/pets`);
  }
};
// GET:(/:id) Lấy ra thông tin chi tiết về sản phẩm dựa vào id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Pet.findOne({
      _id: id,
    });
    res.render(`admin/pages/pets/detail`, { data });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/pets`);
  }
};
// GET:(/edit/:id) lấy ra thon tin sản phẩm dựa vào id và chuyển hướng tới trang edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Pet.findOne({
      _id: id,
    });
    const breeds = await BreedPet.find({ deleted: false });

    res.render("admin/pages/pets/edit.pug", { data, breeds });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/pets`);
  }
};
// PATCH:(edit/:id)  Nhân thông tin chỉnh sửa từ form và tiến hành cật nhập lên
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBy={
      account_id:res.locals.user.id,
      updateAt:new Date()
    }
    await Pet.updateOne(
        { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cật nhật thành công ");
    res.redirect("/admin/pets");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/pets`);
  }
};
// DELETE:(delete/:id) Xóa sản phẩm theo id gửi lên từ form
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Pet.updateOne({ _id: id }, { deleted: true, status: "inactive" });

    req.flash("success", "Đã chuyển vào thùng rác!");
    res.redirect("/admin/pets");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect("/admin/pets");
  }
};
//GET:Lấy ra các sản phẩm co trạng thái là deleted:true
module.exports.bin = async (req, res) => {
  try {
    let find = {
      deleted: true,
    };
    // Tìm kiếm sản phẩm dùng regex
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.name = objectSearch.regex;
    }

    const countProducts = await Pet.countDocuments(find);

    // Pagination
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    const data = await Pet.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    res.render("admin/pages/bin/index.pug", {
      data,
      pagination: objectPagination,
    });
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi ");
    console.log(error);
    res.redirect(`/admin/pets/bin`);
  }
};
module.exports.binDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await Pet.deleteOne({
      _id: id,
    });
    req.flash("success", "Đã đc khôi phục  thùng rác!");
    res.redirect("/admin/pets/bin");
  } catch (error) {}
};
module.exports.reset = async (req, res) => {
  try {
    const id = req.params.id;
    await Pet.updateOne({ _id: id }, { deleted: false, status: "active" });
    req.flash("success", "Đã đc khôi phục  thùng rác!");
    res.redirect("/admin/pets/bin");
  } catch (error) {
    req.flash("error", "Đã xảy ra lỗi");
    console.log(error);
    res.redirect("/admin/pets/bin");
  }
};
// PATCH: Thay đổi trạng thái 1 hoặc nhiều sản phẩm qua checkbox
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids.split(",");
    const type = req.body.type;

    switch (type) {
      case "active":
        await Pet.updateMany({ _id: { $in: ids } }, { status: "active" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Active`
        );
        break;

      case "inactive":
        await Pet.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Inactive`
        );
        break;

      case "deleteAll":
        await Pet.updateMany(
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
          await Pet.updateOne({ _id: id }, { position: position });
        }
        req.flash(
          "success",
          `Thay đổi thành công vị trí của ${ids.length} sản phẩm`
        );
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Pet.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );

  res.redirect("/admin/pets");
};
