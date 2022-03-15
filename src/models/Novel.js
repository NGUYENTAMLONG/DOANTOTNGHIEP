const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const NovelSchema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    chapters: {
      type: Array,
    },
  },
  {
    timestamps: true,
    collection: "Novel",
  }
);
module.exports = mongoose.model("novel", NovelSchema);
