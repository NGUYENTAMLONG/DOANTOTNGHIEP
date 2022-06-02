const mongoose = require("mongoose");
const { VALUES, ROLES } = require("../config/default");
const Manga = require("../models/Manga");
const User = require("../models/User");
const Schema = mongoose.Schema;
const CommentSchema = new Schema(
  {
    mangaId: {
      type: String,
      ref: Manga,
      required: true,
    },
    userId: {
      type: String,
      ref: User,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: ROLES.MEMBER.CODE,
    },
    chapter: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: VALUES.LIKES,
    },
    replies: {
      type: Object,
      required: true,
      default: [],
      replie: {
        type: Object,
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
    },
  },
  { timestamps: true, collection: "Comments", autoIndex: false }
);

module.exports = mongoose.model("comment", CommentSchema);
