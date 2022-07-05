const mongoose = require("mongoose");
const { VALUES } = require("../config/default");
const User = require("../models/User");
const Schema = mongoose.Schema;
const ReplySchema = new Schema(
  {
    from: {
      type: String,
      ref: User,
      required: true,
    },
    to: {
      type: String,
      ref: User,
      required: true,
    },
    replyContent: {
      type: String,
      required: true,
    },
    replyLikes: {
      type: Number,
      required: true,
      default: VALUES.LIKES,
    },
  },
  { timestamps: true, collection: "Replies" }
);

module.exports = mongoose.model("reply", ReplySchema);
