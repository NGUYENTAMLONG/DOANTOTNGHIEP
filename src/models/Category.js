const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const CategorySchema = new Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "name", unique: true },
  thumnail: { type: String, required: true, default: "category.jpg" },
});

module.exports = mongoose.model("category", CategorySchema);
