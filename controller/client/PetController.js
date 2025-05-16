const Pet = require("../../model/PetModel");
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const pets = await Pet.find(find);
    res.render("client/pages/products/pets", { pets });
  } catch (error) {
    console.log(error);
  }
};
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const pet = await Pet.findOne({
      slug:slug
    });
    res.render("client/pages/products/detail",{pet})
  } catch (error) {
    console.log(error);
  }
};
