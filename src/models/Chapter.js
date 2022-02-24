const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new Schema({
  chapterName: {
    type: String,
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  chapterImages: {
    type: Array,
    required: true,
  },
  chapterUpload: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("chapter", ChapterSchema);
