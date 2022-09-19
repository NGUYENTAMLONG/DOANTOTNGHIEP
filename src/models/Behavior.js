const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BehaviorSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    like: {
      type: Boolean,
      required: true,
    },
    rate: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Behavior",
  }
);
module.exports = mongoose.model("behavior", BehaviorSchema);
