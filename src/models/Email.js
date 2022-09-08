const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Emails",
  }
);
// khai bao su dung thu vien da cai dat (mongoose-delete)-> de thuc hien trien khai chuc nang xoa mem soft delete
const mongooseDelete = require("mongoose-delete");
EmailSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("email", EmailSchema);
