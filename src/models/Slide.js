const mongoose = require("mongoose");
const Manga = require("../models/Manga");
const SlideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    manga: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: Manga,
    },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Slides",
  }
);
module.exports = mongoose.model("slide", SlideSchema);
