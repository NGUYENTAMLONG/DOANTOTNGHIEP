const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const UserLocal = require("../models/UserLocal");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
dotenv.config();
class UserController {
  async getUserInfo(req, res) {
    try {
      let UserInfo;
      if (req.user.provider === "LOCAL") {
        UserInfo = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        UserInfo = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        UserInfo = await UserFacebook.findById(req.user.id);
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, UserInfo));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new UserController();
