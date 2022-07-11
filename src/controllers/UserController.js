const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
dotenv.config();
class userManagementController {
  async showUserDashboard(req, res) {
    try {
      const userList = await User.find();
      res.render("admin/human/user/userDashBoard", { userList, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new userManagementController();
