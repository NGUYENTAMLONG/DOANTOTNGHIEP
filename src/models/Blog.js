const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const { BLOG_STATUS, BLOG_ROLE } = require("../config/default");
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    author: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      default: "cover-blog-default.jpg",
    },
    content: {
      type: String,
      required: true,
    },
    keywords: {
      type: Object,
      required: true,
      keyword: {
        type: String,
        required: true,
      },
    },
    statistical: {
      type: Object,
      default: {
        likes: 0,
        views: 0,
        rating: 0,
        counting: 0,
      },
    }, // updating...(ex: require)
    source: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: BLOG_ROLE.ADMIN.CODE,
    },
    link: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: BLOG_STATUS.ACTIVE,
    },
    writtenBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    passport: {
      type: String,
      required: false,
      default: null,
    },
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
    collection: "Blogs",
  }
);
// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
BlogSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("blog", BlogSchema);
