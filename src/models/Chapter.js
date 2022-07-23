const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new Schema(
  {
    manga: { type: String, required: true },
    chapters: {
      type: Object,
      default: [],
      chapter: {
        chapterNumber: {
          type: Number,
          required: true,
          unique: true,
        },
        chapterName: {
          type: String,
          required: true,
        },
        chapterContent: {
          type: String,
          required: true,
        },
        statistical: {
          type: Object,
          default: {
            views: 0,
            comments: 0,
            likes: 0,
          },
        },
        createdTime: {
          type: Date,
          required: true,
        },
        updatedTime: {
          type: Date,
          required: true,
        },
      },
    },
  },
  { collection: "Chapters", timestamps: true }
);
module.exports = mongoose.model("chapter", ChapterSchema);
