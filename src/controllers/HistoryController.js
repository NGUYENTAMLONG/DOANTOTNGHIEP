const Manga = require("../models/Manga");
const moment = require("moment");
const { redirect } = require("../service/redirect");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const { types } = require("../config/default");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const UserLocal = require("../models/UserLocal");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");
const History = require("../models/History");

let visitedMangas = null;
class historyController {
  async showHistoryWithPostMethod(req, res) {
    try {
      const { visit } = req.body;
      visitedMangas = JSON.parse(visit);
      console.log(visitedMangas);
      const match = filterMangas(req);
      match.slug = { $in: visitedMangas };
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
      res.render("showHistory", {
        user: req.user,
        moment,
        title: `<i class='bx bx-history'></i> Lịch sử đọc truyện`,
        flag: false,
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
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showHistoryWithGetMethod(req, res) {
    try {
      const match = filterMangas(req);
      match.slug = { $in: visitedMangas };
      console.log(visitedMangas);
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
        title: `<i class='bx bx-history'></i> Lịch sử đọc truyện`,
        flag: false,
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
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async clearVisit(req, res) {
    visitedMangas = null;
    return res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
  }
  async clearVisitJustOne(req, res) {
    const { manga } = req.param;
    visitedMangas = visitedMangas.filter(function (elm, index) {
      return elm !== manga;
    });
    console.log(visitedMangas);
    return res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
  }
  async clearVisitOfUser(req, res) {
    const mangaId = req.params.id;
    if (!mangaId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!req.user) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.UNAUTHORIZED
            )
          );
      }
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
      }
      await History.updateOne(
        {
          _id: foundUser.history,
        },
        { $pull: { mangaList: { mangaId: mangaId } } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new historyController();
