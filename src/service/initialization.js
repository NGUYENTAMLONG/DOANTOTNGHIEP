const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { ROLES } = require("../config/default");
const Admin = require("../models/Admin");
dotenv.config();

async function initHRAdminAcount() {
  try {
    //check exists account
    const checkAccount = await Admin.findOne({
      username: process.env.HR_ADMIN_USERNAME,
      email: process.env.HR_ADMIN_EMAIL,
    });
    if (checkAccount) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.HR_ADMIN_PASSWORD,
      salt
    );
    const newAdmin = new Admin({
      username: process.env.HR_ADMIN_USERNAME,
      password: hashedPassword,
      role: ROLES.HR_ADMIN.CODE,
      email: process.env.HR_ADMIN_EMAIL,
    });
    const createdAdmin = await newAdmin.save();
  } catch (error) {
    console.log(error);
    throw new Error("ERROR SERVER");
  }
}

async function initContentAdminAcount() {
  try {
    //check exists account
    const checkAccount = await Admin.findOne({
      username: process.env.CONTENT_ADMIN_USERNAME,
      email: process.env.CONTENT_ADMIN_EMAIL,
    });
    if (checkAccount) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.CONTENT_ADMIN_PASSWORD,
      salt
    );
    const newAdmin = new Admin({
      username: process.env.CONTENT_ADMIN_USERNAME,
      password: hashedPassword,
      role: ROLES.CONTENT_ADMIN.CODE,
      email: process.env.CONTENT_ADMIN_EMAIL,
    });
    const createdAdmin = await newAdmin.save();
  } catch (error) {
    console.log(error);
    throw new Error("ERROR SERVER");
  }
}
module.exports = { initHRAdminAcount, initContentAdminAcount };
