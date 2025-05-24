const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const petSchema = mongoose.Schema(
  {
    name: String,
    breed_pet_id: { type: String, default: "" },
    age: Number,
    color: String,
    gender: String,
    birthDate: Date,
    // user_id:String,// Tên chủ sở hữu
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
    description: String,
    price: String,
    position: Number,
    status: { type: String, default: "active" },
    thumbnail: String,
    slug: { type: String, slug: ["name"], unique: true },
    deleted: { type: Boolean, default: false },
    deletedBy: {
      account_id: String,
      deletedAt: {
        type: String,
        default: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);
const Pet = mongoose.model("pets", petSchema, "pets");
module.exports = Pet;
