const Admin = require("../models/Admin");
const User = require("../models/UserLocal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
dotenv.config();
class adminManagementController {
  async showAdminDashboard(req, res) {
    try {
      const adminList = await Admin.find();
      res.render("admin/human/admin/adminDashboard", { adminList, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async showUserDashboard(req, res) {
    try {
      const userList = await User.find();
      res.render("admin/human/user/userDashboard", { userList, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async showAnalysis(req, res) {
    Promise.all([Admin.find(), User.find()])
      .then(([adminList, userList]) => {
        res.render("admin/human/analysis/analysis", {
          adminList,
          userList,
          moment,
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(STATUS.SERVER_ERROR)
          .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
      });
  }

  async showNotification(req, res) {}
}

module.exports = new adminManagementController();
