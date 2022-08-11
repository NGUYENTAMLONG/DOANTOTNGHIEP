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
const { ErrorResponse, SuccessResponse } = require("../helper/response");
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
  async showAdminTrash(req, res) {
    try {
      const adminList = await Admin.findDeleted({});
      res.render("admin/human/admin/adminTrash", { adminList, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async softDeleteAdmin(req, res) {
    const idAdmin = req.params.id;
    if (!idAdmin) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //note : no unlink avatar
      await Admin.delete({ _id: idAdmin });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async softDeleteCheckedAdmin(req, res) {
    const { idList } = req.body;
    if (!idList || idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //note : no unlink avatar
      await Admin.delete({ _id: { $in: idList } });

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async restoreAdmin(req, res) {
    const idAdmin = req.params.id;
    if (!idAdmin) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await Admin.restore({ _id: idAdmin });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RESTORE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async restoreCheckedAdmin(req, res) {
    const idList = req.body;
    if (!idList || idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      console.log("fdsafdasf", idList);
      await Admin.restore({ _id: { $in: idList } });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RESTORE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
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

  //API
  //1. Get Admin List with paging
  // route: /management/content/manga/api/getList - Method: GET
  async getAdminList(req, res) {
    const { search, sort, order, offset, limit } = req.query;
    try {
      const admins = await Admin.find({})
        .skip(Number(offset))
        .limit(Number(limit));
      res.status(STATUS.SUCCESS).json({
        rows: admins,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //2.Create Admin
  async createAdmin(req, res) {
    const { username, password, role, email } = req.body;
    // return res.json({ username, password, role, email });
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAmin = new Admin({
        username,
        password: hashedPassword,
        role,
        email,
      });
      const createAdmin = await newAmin.save();

      res.status(STATUS.CREATED).json({
        created: createAdmin,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //3.Get Deleted Admin List
  async getDeletedAdmins(req, res) {
    const { search, sort, order, offset, limit } = req.query;
    try {
      const admins = await Admin.findDeleted({})
        .skip(Number(offset))
        .limit(Number(limit));
      res.status(STATUS.SUCCESS).json({
        rows: admins,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new adminManagementController();
