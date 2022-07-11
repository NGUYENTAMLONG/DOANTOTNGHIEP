const Admin = require("../models/Admin");
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
const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
dotenv.config();
class adminManagementController {
  async showAdminDashboard(req, res) {
    try {
      const adminList = await Admin.find();
      res.render("admin/human/admin/admindashboard", { adminList, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }

  async showStatistical(req, res) {
    Promise.all([Admin.find(), User.find(), Manga.find(), Slide.find()])
      .then(([adminList, userList, mangaList, slideList]) => {
        res.render("admin/human/analysis/statistical", {
          adminList,
          userList,
          mangaList,
          slideList,
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

  async showAnalysis(req, res) {
    Promise.all([Admin.find(), User.find(), Manga.find(), Slide.find()])
      .then(([adminList, userList, mangaList, slideList]) => {
        res.render("admin/human/analysis/analysis", {
          adminList,
          userList,
          mangaList,
          slideList,
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

  async showNotification(req, res) {
    Promise.all([Admin.find()])
      .then(([adminList, userList, mangaList, slideList]) => {
        res.render("admin/human/analysis/notification", {
          adminList,
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
}

module.exports = new adminManagementController();
