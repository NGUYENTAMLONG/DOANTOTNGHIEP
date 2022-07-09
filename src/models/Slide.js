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
    content: {
      type: String,
    },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Slides",
  }
);

const mongooseDelete = require("mongoose-delete");
SlideSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("slide", SlideSchema);
