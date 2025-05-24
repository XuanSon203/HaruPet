const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const serviceSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    slug: { type: String, slug: ["title"], unique: true },
    position: Number,
    price: Number,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
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
    thumbnail: String,
    status: { type: String, default: "active" },

    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Services = mongoose.model("services", serviceSchema, "services");
module.exports = Services;
