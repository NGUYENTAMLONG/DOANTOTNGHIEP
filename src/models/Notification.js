const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);
//Private notification schema

const NotificationPrivateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default: "notification.jpg",
    },
    content: { type: String, required: true },
    toUser: [{ userId: mongoose.Schema.Types.ObjectId }],
    fromUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    url: {
      type: String,
      required: true,
      //  slug: "name",
      //   unique: true
    },
    read: { type: Boolean, default: false },
  },
  {
    collection: "PrivateNotification",
    timestamps: true,
  }
);

NotificationPrivateSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
//Public notification schema

const NotificationPublicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default: "/public/notification/notification.jpg",
    },
    fromUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    url: { type: String, unique: true },
  },
  {
    collection: "PublicNotification",
    timestamps: true,
  }
);

NotificationPublicSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = {
  PublicNotification: mongoose.model(
    "public-notification",
    NotificationPublicSchema
  ),
  PrivateNotification: mongoose.model(
    "private-notification",
    NotificationPrivateSchema
  ),
};
