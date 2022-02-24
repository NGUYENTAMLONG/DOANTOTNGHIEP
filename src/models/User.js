const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: { type: String, required: false, unique: true },
    avatar: {
      type: String,
      default: "avatar.png",
    },
  },
  { timestamps: true, collection: "Users" }
);

module.exports = mongoose.model("user", UserSchema);
