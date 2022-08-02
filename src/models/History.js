const mongoose = require("mongoose");
const VisitedMangaSchema = new mongoose.Schema({
  mangaId: mongoose.Schema.Types.ObjectId,
  visitedAt: Date,
});

const HistorySchema = new mongoose.Schema(
  {
    mangaList: [VisitedMangaSchema],
  },
  {
    timestamps: true,
    collection: "Histories",
  }
);

const mongooseDelete = require("mongoose-delete");
HistorySchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("History", HistorySchema);
