const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const breedPetSchema = mongoose.Schema(
  {
  
    parent_id: String,
    title: String,
    description: String,
    createdBy: {
      account_id: String,
      createdAt: {
        type: String,
        default: Date.now,
      },
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: {
          type: String,
          default: Date.now,
        },
      },
    ],
    slug: { type: String, slug: ["title"], unique: true },
    position: Number,
    thumbnail: String,
    status: { type: String, default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const BreedPet = mongoose.model("breedsPet", breedPetSchema, "breedsPet");
module.exports = BreedPet;
