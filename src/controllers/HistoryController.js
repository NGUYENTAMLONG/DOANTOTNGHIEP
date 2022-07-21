const Manga = require("../models/Manga");
const moment = require("moment");
const { redirect } = require("../service/redirect");
const { STATUS, MESSAGE } = require("../config/httpResponse");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const { types } = require("../config/default");
const { SuccessResponse } = require("../helper/response");

let visitedMangas = null;
class historyController {
  async showHistoryWithPostMethod(req, res) {
    try {
      const { visit } = req.body;
      visitedMangas = JSON.parse(visit);
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
        user: req.AuthPayload,
        moment,
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
        user: req.AuthPayload,
        moment,
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
}

module.exports = new historyController();
