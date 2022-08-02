const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const { types } = require("../config/default");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
class MangaController {
  async show(req, res, next) {
    try {
      const match = filterMangas(req);
      match.type = { $in: req.params.type };
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

      const category = types.filter((item) => item.name === req.params.type)[0];
      res.render("showCategory", {
        user: req.user,
        moment: moment,
        mangas: orderManga(result.mangas),
        category: category,
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
module.exports = new MangaController();
