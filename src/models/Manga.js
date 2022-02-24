const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const MangaSchema = new Schema(
  {
    name: { type: String, required: true },
    anotherName: { type: String },
    image: { type: String }, // updating...(ex: require)
    author: { type: String, required: true },
    type: { type: Array, required: true },
    serve: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    hot: { type: Boolean },
    statistical: { type: Object }, // updating...(ex: require)
    chapters: { type: Array }, // updating... (ex: require)
    fanmade: { type: Boolean, required: true },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
    collection: "Manga",
  }
);
module.exports = mongoose.model("manga", MangaSchema);
