const Pet = require("../../model/PetModel");
const BreedPet = require("../../model/BreedPetModel");
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const pets = await Pet.find(find);

    const breedPet = await BreedPet.find();
    res.render("client/pages/products/pets", { pets, breedPet });
  } catch (error) {
    console.log(error);
  }
};
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const pet = await Pet.findOne({
      slug: slug,
    });
    res.render("client/pages/products/detail", { pet });
  } catch (error) {
    console.log(error);
  }
};
module.exports.show = async (req, res) => {
  try {
    const slug = req.params.slug;
     const breedPets = await BreedPet.find();
    const breedPet = await BreedPet.findOne({
      slug: slug,
    });
    const pets = await Pet.find({
      breed_pet_id: breedPet._id,
    });
    res.render("client/pages/products/petCategory",{pets,breedPets})
  } catch (error) {
    console.log(error);
  }
};
