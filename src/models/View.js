const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ViewSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
    check: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Views",
  }
);

module.exports = mongoose.model("view", ViewSchema);
