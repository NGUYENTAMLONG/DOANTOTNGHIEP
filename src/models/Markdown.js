const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarkdownDetailSchema = new mongoose.Schema({
  mangaId: mongoose.Schema.Types.ObjectId,
  chapterMarkdown: {
    type: Number,
    required: true,
  },
  markdownAt: Date,
});

const MarkdownSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // note: Not use ref
    },
    markdownList: [MarkdownDetailSchema],
  },
  {
    collection: "Markdowns",
    timestamps: true,
  }
);

module.exports = mongoose.model("markdown", MarkdownSchema);
