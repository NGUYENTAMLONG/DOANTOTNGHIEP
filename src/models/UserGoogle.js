const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PASSPORT } = require("../config/default");
const findOrCreate = require("mongoose-findorcreate");

const UserGoogleSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    passport: {
      type: String,
      required: true,
      default: PASSPORT.GOOGLE,
    },
    googleId: {
      type: String,
      default: null,
    },
    email: { type: String, required: false, unique: true },
    dob: {
      type: Date, //dob: Date of Birth
      default: null,
    },
    avatar: {
      type: String,
      required: true,
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
  },
  { timestamps: true, collection: "UserGoogles" }
);

// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
UserGoogleSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
UserGoogleSchema.plugin(findOrCreate);

module.exports = mongoose.model("usergoogle", UserGoogleSchema);
