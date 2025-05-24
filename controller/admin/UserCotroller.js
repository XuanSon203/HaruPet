const User = require("../../model/UserModel");
const Account = require("../../model/AccountModel");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

module.exports.index = async (req, res) => {
  try {
    let find = { deleted: false };

    // Tìm kiếm người dùng
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.$or = [
        { fullName: objectSearch.regex },
        { email: objectSearch.regex },
      ];
    }

    const countProducts = await User.countDocuments(find);

    // Phân trang
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );

    // Lấy danh sách users
    const users = await User.find(find)
      .select("-password -tokenUser")
      .sort({ createdAt: -1 })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

    // Lấy thông tin người cập nhật cuối cùng (nếu có updatedBy)
    for (let user of users) {
      const updatedBy = user.updatedBy[user.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }

    res.render("admin/pages/users/index", {
      users,
      pagination: objectPagination,
      objectSearch,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    res.status(500).send("Lỗi khi lấy danh sách người dùng");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    // Lấy token từ cookie để biết ai là người cập nhật
    const token = req.cookies.token;
    const account = await Account.findOne({ token });

    if (!account) {
      return res.redirect("/login");
    }

    const updatedBy = {
      account_id: account._id,
      updatedAt: new Date(),
    };

    await User.updateOne(
      { _id: id },
      {
        status: status,
          loginAttempts: 0,
        $push: { updatedBy: updatedBy },
      }
    );

    res.redirect("/admin/users");
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).send("Lỗi cập nhật trạng thái");
  }
};

module.exports.delete=async(req,res)=>{
   try {
      const id = req.params.id;
      await User.deleteOne({
        _id: id,
      });
      req.flash("success", "Đã xoá tài khoản ");
      res.redirect("/admin/users");
    } catch (error) {}
}