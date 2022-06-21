const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { VALUES } = require("../config/default");
dotenv.config();

class Authorization {
  async authorH(req, res, next) {
    const token = req.cookies.token;
    // res.json(token);
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findById(tokenVerify._id);
      const adminList = await Admin.find();

      if (tokenVerify.role === "hrm_admin") {
        next();
      } else {
        res.status(403).json({
          message: "you don’t have permission to access",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error, message: "No Authentication" });
    }
  }
  async authorM(req, res, next) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      if (tokenVerify.role === "manga_admin") {
        next();
      } else {
        res.status(403).json({
          message: "you don’t have permission to access",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error, message: "No Authentication" });
    }
  }
}

module.exports = new Authorization();
