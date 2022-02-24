const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const SlideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    type: {
      type: Array,
      required: true,
    },
    move: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
    collection: "Slides",
  }
);
module.exports = mongoose.model("slide", SlideSchema);
