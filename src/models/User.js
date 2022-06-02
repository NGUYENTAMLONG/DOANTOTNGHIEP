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
      default: "avatar_default.jpg",
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
