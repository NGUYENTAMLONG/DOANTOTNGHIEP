const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
async function Authentication(req, res, next) {
  const { account, password: plainTextPassword } = req.body;
  const admin = await Admin.findOne({ account });
  if (!admin) {
    return res.json({ status: "error", error: "Invalid account" });
  }
  try {
    const authPassword = await bcrypt.compare(
      plainTextPassword,
      admin.password
    );
    if (!authPassword) {
      res.status(401).json({ status: "error", error: "Invalid password !!!" });
    }
    const { password, _id, role, account, ...others } = admin._doc;
    const token = jwt.sign({ _id, account, role }, process.env.TOKEN_SECRET);
    // req.token = token;
    res.cookie("token", token);
    res.status(200).json(role);
    next();
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: error });
  }
}
module.exports = Authentication;
