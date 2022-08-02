const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { VALUES, types } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const UserLocal = require("../models/UserLocal");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const Manga = require("../models/Manga");
const History = require("../models/History");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
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
      console.log("ERROR (USERCONTROLLER): ", error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    }
  }
  async showProfile(req, res) {
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
      }
      res.status(STATUS.SUCCESS).render("profile", { user: foundUser, moment });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  }
  async showHistory(req, res) {
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
      }

      const mangaVisited = await History.findById(foundUser.history);
      const idList = mangaVisited.mangaList.map((item) => item.mangaId);
      const mangas = await Manga.find({ _id: { $in: idList } });
      // res.status(STATUS.SUCCESS).render("showVisited", { user: UserInfo });

      const match = filterMangas(req);
      match._id = { $in: mangas };
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate({
          path: "contentId",
          options: {
            chapters: { $slice: -1 },
          },
        })
        .limit(limit)
        .skip(startPage)
        .exec();
      // return res.json(result.mangas);
      res.render("showHistory", {
        user: req.user,
        moment,
        flag: true,
        title: `<i class="fas fa-compass"></i> Các bộ truyện bạn đã ghé thăm`,
        categories: types,
        mangas: result.mangas,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
      // res.status(STATUS.SUCCESS).json({ mangas });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  }
  async updateUsername(req, res) {
    const { username } = req.body;
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
        await UserLocal.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
        await UserGoogle.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
        await UserFacebook.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, UserInfo));
    }
  }
}

module.exports = new UserController();
