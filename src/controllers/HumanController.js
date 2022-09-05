const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const UserLocal = require("../models/UserLocal");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const moment = require("moment");
dotenv.config();
class humanController {
  async showAnalysis(req, res) {
    Promise.all([Admin.find()])
      .then(([adminList]) => {
        res.render("admin/human/analysis/analysis", {
          admin: req.user,
          adminList,
          ggUser: UserGoogle,
          fbUser: UserFacebook,
          lcUser: UserLocal,
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

  async showHumanAnalysis(req, res) {
    Promise.all([
      Admin.find(),
      UserGoogle.find(),
      UserFacebook.find(),
      UserLocal.find(),
    ])
      .then(([adminList, ggUser, fbUser, lcUser]) => {
        res.render("admin/human/analysis/analysis", {
          admin: req.user,
          adminList,
          ggUser,
          fbUser,
          lcUser,
          moment,
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(STATUS.SERVER_ERROR)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
          );
      });
  }
  //API
  //************* Admin Controller ******************
  async createAdmin(req, res, next) {}
  //************* User Controller ******************
  // find All User accounts
  async findAllUsers(req, res, next) {}
  // find User account (by ID)
  async findUserById(req, res, next) {}
  // create User account
  async createUser(req, res, next) {}
}

module.exports = new humanController();
