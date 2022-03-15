const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new Schema(
  {
    chapters: {
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
    },
  },
  { collection: "Chapters", timestamps: true }
);
module.exports = mongoose.model("chapter", ChapterSchema);
