const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PASSPORT, ROLES } = require("../config/default");
const findOrCreate = require("mongoose-findorcreate");

const UserFacebookSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    passport: {
      type: String,
      required: true,
      default: PASSPORT.FACEBOOK,
    },
    facebookId: {
      type: String,
      default: null,
    },
    email: { type: String, required: false, unique: true },
    dob: {
      type: Date, //dob: Date of Birth
      default: null,
    },
    gender: {
      type: String,
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
    role: {
      type: String,
      default: ROLES.MEMBER.CODE,
    },
    history: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collection: "UserFacebooks" }
);

// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
UserFacebookSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
UserFacebookSchema.plugin(findOrCreate);

module.exports = mongoose.model("userfacebook", UserFacebookSchema);
