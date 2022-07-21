const { VALUES, types } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
class CountryController {
  async show(req, res, next) {
    try {
      const match = filterMangas(req);
      match.country = req.params.slug;
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
      // return res.json(result);
      res.render("showCountryManga", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fas fa-globe-africa"></i> ${req.params.slug}`,
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
module.exports = new CountryController();
