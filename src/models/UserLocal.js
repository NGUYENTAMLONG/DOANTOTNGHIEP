const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PASSPORT } = require("../config/default");
const findOrCreate = require("mongoose-findorcreate");

const UserLocalSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    passport: {
      type: String,
      required: true,
      default: PASSPORT.LOCAL,
    },
    email: { type: String, required: false, unique: true },
    dob: {
      type: Date, //dob: Date of Birth
      required: true,
    },
    gender: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "/public/avatars/user_avatar_default.jpg",
    },
    active: {
      type: Boolean,
      default: true,
    },
    followedList: {
      type: Array,
      default: [],
    },
    likedList: {
      type: Array,
      default: [],
    },
    ratedList: {
      type: Array,
      default: [],
    },
    history: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collection: "UserLocals" }
);

// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
UserLocalSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
UserLocalSchema.plugin(findOrCreate);

module.exports = mongoose.model("userlocal", UserLocalSchema);
