const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminSchema = new Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    avatar: {
      type: String,
      default: "avatar.png",
      required: false,
    },
  },
  { timestamps: true, collection: "Admins" }
);

module.exports = mongoose.model("admin", AdminSchema);
