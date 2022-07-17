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
    dob: {
      type: Date, //dob: Date of Birth
      required: true,
    },
    avatar: {
      type: String,
      default: "user_avatar_default.jpg",
    },
    active: {
      type: Boolean,
      default: false,
    },
    follows: {
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
