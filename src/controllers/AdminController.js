const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
class adminManagementController {
  //ADMIN ACCOUNT CONTROLLER ***********************************************************************************
  async showAdminDashboard(req, res) {
    try {
      const adminList = await Admin.find();
      res.render("admin/human/admin/adminDashboard", {
        admin: req.user,
        adminList,
        moment,
      });
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
      res.render("admin/human/admin/adminTrash", {
        admin: req.user,
        adminList,
        moment,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async showAdminCreate(req, res) {
    return res.status(STATUS.SUCCESS).render("admin/human/admin/create", {
      admin: req.user,
    });
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

  async showAnalysis(req, res) {
    Promise.all([Admin.find()])
      .then(([adminList]) => {
        res.render("admin/human/analysis/analysis", {
          admin: req.user,
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

  async showNotification(req, res) {}

  //API
  //1. Get Admin List with paging
  // route: /management/content/manga/api/getList - Method: GET
  async getAdminList(req, res) {
    const { search, sort, order, offset, limit } = req.query;
    try {
      const admins = await Admin.find({});
      // .skip(Number(offset))
      // .limit(Number(limit));
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
    if (!username || !password || !role || !email) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      console.log({ username, password, role, email });
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
    try {
      const admins = await Admin.findDeleted({});
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
  //4. Create Avatar Admin
  async createAvatarAdmin(req, res) {
    console.log(req.file);
    res.json(req.file);
  }
  //USER ACCOUNT CONTROLLER ***********************************************************************************

  async showUserDashboard(req, res) {
    Promise.all([
      UserLocal.find({}),
      UserFacebook.find({}),
      UserGoogle.find({}),
    ])
      .then(([UserLocalList, UserFacebookList, UserGoogleList]) => {
        const userList = [
          ...UserLocalList,
          ...UserFacebookList,
          ...UserGoogleList,
        ];
        res.render("admin/human/user/userDashboard", {
          admin: req.user,
          userList,
          userFacebookList: UserFacebookList,
          userGoogleList: UserGoogleList,
          userLocalList: UserLocalList,
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
  async showUserTrash(req, res) {
    Promise.all([
      UserLocal.findDeleted({}),
      UserFacebook.findDeleted({}),
      UserGoogle.findDeleted({}),
    ])
      .then(([UserLocalList, UserFacebookList, UserGoogleList]) => {
        const userList = [
          ...UserLocalList,
          ...UserFacebookList,
          ...UserGoogleList,
        ];
        res.render("admin/human/user/userTrash", {
          admin: req.user,
          userList,
          userFacebookList: UserFacebookList,
          userGoogleList: UserGoogleList,
          userLocalList: UserLocalList,
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

  async getUserList(req, res) {
    Promise.all([
      UserLocal.find({}),
      UserFacebook.find({}),
      UserGoogle.find({}),
    ])
      .then(([UserLocalList, UserFacebookList, UserGoogleList]) => {
        res.status(STATUS.SUCCESS).json({
          rows: [...UserLocalList, ...UserFacebookList, ...UserGoogleList],
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

  async softDeleteUser(req, res) {
    const idUser = req.params.id;
    const { passport } = req.body;
    if (!idUser) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //note : no unlink avatar
      if (passport === "LOCAL") {
        await UserLocal.delete({ _id: idUser });
      } else if (passport === "GOOGLE") {
        await UserGoogle.delete({ _id: idUser });
      } else if (passport === "FACEBOOK") {
        await UserFacebook.delete({ _id: idUser });
      }
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
  async softDeleteCheckedUser(req, res) {
    const deleteList = req.body;
    if (!deleteList || deleteList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      deleteList.forEach(async (element) => {
        try {
          if (element.passport === "LOCAL") {
            await UserLocal.delete({ _id: element.userId });
          } else if (element.passport === "GOOGLE") {
            await UserGoogle.delete({ _id: element.userId });
          } else {
            await UserFacebook.delete({ _id: element.userId });
          }
        } catch (error) {
          throw new Error("ERROR DELETE CHECKED");
        }
      });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async restoreUser(req, res) {
    const idUser = req.params.id;
    const { passport } = req.body;
    if (!idUser) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (passport === "LOCAL") {
        await UserLocal.restore({ _id: idUser });
      } else if (passport === "GOOGLE") {
        await UserGoogle.restore({ _id: idUser });
      } else if (passport === "FACEBOOK") {
        await UserFacebook.restore({ _id: idUser });
      }
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
  async restoreCheckedUser(req, res) {
    const restoreList = req.body;
    if (!restoreList || restoreList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      restoreList.forEach(async (element) => {
        try {
          if (element.passport === "LOCAL") {
            await UserLocal.restore({ _id: element.userId });
          } else if (element.passport === "GOOGLE") {
            await UserGoogle.restore({ _id: element.userId });
          } else {
            await UserFacebook.restore({ _id: element.userId });
          }
        } catch (error) {
          throw new Error("ERROR RESTORE CHECKED");
        }
      });
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
  // API USER*******************************************************************
  async getDeletedUsers(req, res) {
    Promise.all([
      UserLocal.findDeleted({}),
      UserFacebook.findDeleted({}),
      UserGoogle.findDeleted({}),
    ])
      .then(([UserLocalList, UserFacebookList, UserGoogleList]) => {
        res.status(STATUS.SUCCESS).json({
          rows: [...UserLocalList, ...UserFacebookList, ...UserGoogleList],
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
}

module.exports = new adminManagementController();
