const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminSchema = new Schema(
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
    role: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    avatar: {
      type: String,
      default: "admin_avatar_default.png",
      required: false,
    },
  },
  { timestamps: true, collection: "Admins" }
);

// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
AdminSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("admin", AdminSchema);
