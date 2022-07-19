const Manga = require("../models/Manga");
const moment = require("moment");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const lodash = require("lodash");
const { RANDOM_SIZE, types, MANGA_STATUS } = require("../config/default");
const pagination = require("../service/pagination");
const filterMangas = require("../service/filterMangas");
class FilterController {
  async showRandomManga(req, res, next) {
    try {
      const mangas = await Manga.find().populate("contentId", {
        chapters: { $slice: -1 },
      });
      const randomMangas = lodash.sampleSize(mangas, RANDOM_SIZE);
      res.render("showRandomManga", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fas fa-random"></i> Truyện ngẫu nhiên`,
        mangas: randomMangas,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showNewManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .sort({ createdAt: -1 })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showNewManga", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fas fa-lightbulb"></i> Truyện mới xuất bản`,
        mangas: result.mangas,
        categories: types,
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
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showCompleteManga(req, res, next) {
    try {
      const match = filterMangas(req);
      match.status = MANGA_STATUS.FINISHED;
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showCompleteManga", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fas fa-check-circle"></i> Truyện đã hoàn thành`,
        mangas: result.mangas,
        categories: types,
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
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showUnfinishedManga(req, res, next) {
    try {
      const match = filterMangas(req);
      match.status = MANGA_STATUS.UNFINISHED;
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showUnfinishedManga", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fas fa-fire"></i> Truyện đang tiến hành`,
        mangas: result.mangas,
        categories: types,
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
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showUnfinishedManga(req, res, next) {
    try {
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new FilterController();
