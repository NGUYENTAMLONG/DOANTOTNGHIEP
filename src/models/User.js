const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PASSPORT } = require("../config/default");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    passport: {
      type: String,
      required: true,
      default: PASSPORT.LOCAL,
    },
    email: { type: String, required: false, unique: true },
    dob: {
      type: Date, //dob: Date of Birth
      default: "",
    },
    avatar: {
      type: String,
      default: "user_avatar_default.jpg",
    },
    active: {
      type: Boolean,
      default: true,
    },
    followedList: {
      type: Array,
    },
    likedList: {
      type: Array,
    },
    ratedList: {
      type: Array,
    },
  },
  { timestamps: true, collection: "Users" }
);

// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
UserSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
module.exports = mongoose.model("user", UserSchema);
