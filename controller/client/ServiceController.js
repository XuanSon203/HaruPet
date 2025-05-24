const Services = require("../../model/ServiceModel");
const User = require("../../model/UserModel");
module.exports.index = async (req, res) => {
  try {
    let find = { deleted: false };
    const services = await Services.find(find);
    res.render("client/pages/services/index", { services });
  } catch (error) {
    console.log(error);
  }
};
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const service = await Services.findOne({
      slug: slug,
    });
    res.render("client/pages/services/detail", { service });
  } catch (error) {
    console.log(error);
  }
};
