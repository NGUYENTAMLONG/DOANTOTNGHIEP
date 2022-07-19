const Manga = require("../models/Manga");
const moment = require("moment");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { orderManga } = require("../helper/order");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const { types } = require("../config/default");

class JustUpdatedController {
  async showJustUpdated(req, res, next) {
    try {
      const match = filterMangas(req);
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

      res.render("showJustUpdated", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fab fa-hotjar"></i> Truyện mới cập nhật`,
        mangas: orderManga(result.mangas),
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
}

module.exports = new JustUpdatedController();
